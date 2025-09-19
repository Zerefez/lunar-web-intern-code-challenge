import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../framework/components/Button';
import { formatAmount } from '../../framework/utils/formatAmount';
import { formatDate } from '../../framework/utils/formatDate';
import { useDeleteAuthorizationMutation } from './delete_authorization';
import { useTransactionsQuery } from './get_transactions';

type TransactionsProps = {
  userId: string;
};

type SortOrder = 'newest' | 'oldest';

export const Transactions = ({ userId }: TransactionsProps) => {
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(() => {
    const saved = localStorage.getItem('transactions-sort-order');
    return (saved as SortOrder) || 'newest';
  });
  
  const { data, loading, error } = useTransactionsQuery({
    variables: {
      userId,
    },
  });

  const [deleteAuthorization, { loading: deleteLoading }] = useDeleteAuthorizationMutation({
    refetchQueries: ['GetTransactions'],
  });

  const processedTransactions = React.useMemo(() => {
    if (!data?.transactions) return [];
    
    return data.transactions
      .filter(transaction => !transaction.deleted)
      .sort((a, b) => {
        const dateA = new Date(a.time).getTime();
        const dateB = new Date(b.time).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [data?.transactions, sortOrder]);

  const handleDeleteAuthorization = async (transactionId: string) => {
    try {
      await deleteAuthorization({
        variables: { transactionId },
      });
    } catch (error) {
      console.error('Failed to delete authorization:', error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'newest' ? 'oldest' : 'newest';
      localStorage.setItem('transactions-sort-order', newOrder);
      return newOrder;
    });
  };

  const getSortIcon = () => {
    return sortOrder === 'newest' ? '↓' : '↑';
  };

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred 😭</div>;
  }

  return (
    <StyledCard>
      <StyledTable>
        <StyledTableHeader>
          <tr>
            <th>Icon</th>
            <th>Type</th>
            <th>Title</th>
            <th>Amount</th>
            <th>
              <SortableHeader onClick={toggleSortOrder}>
                Time {getSortIcon()}
              </SortableHeader>
            </th>
            <th>Status</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </StyledTableHeader>
        <tbody>
          {processedTransactions.map(transaction => (
            <StyledTransaction key={transaction.id}>
              <td>
                <img src={transaction.iconURL} alt="" />
              </td>
              <td>{transaction.type}</td>
              <td>{transaction.localizableTitle}</td>
              <td>
                {formatAmount(transaction.billingAmount.amount, transaction.billingAmount.currency)}
              </td>
              <td>{formatDate(transaction.time)}</td>
              <td>
                <StatusBadge status={transaction.status}>
                  {transaction.status}
                </StatusBadge>
              </td>
              <td>
                <img src={transaction.categoryIconUrl} alt="" />
              </td>
              <td>
                {transaction.status === 'authorization' && (
                  <DeleteButton
                    onClick={() => handleDeleteAuthorization(transaction.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </DeleteButton>
                )}
              </td>
            </StyledTransaction>
          ))}
        </tbody>
      </StyledTable>
    </StyledCard>
  );
};

const StyledTable = styled.table`
  width: 100%;
  position: relative;

  td,
  th {
    padding: 8px;
  }
`;

const StyledTableHeader = styled.thead`
  color: ${({ theme }) => theme.secondaryText};

  th {
    text-align: left;
  }
`;

const StyledTransaction = styled.tr`
  img {
    height: 30px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fade1};
  }
`;

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.surface};
  padding: 16px;
  flex: 1 0 auto;
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 16px;
`;

const SortableHeader = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-align: left;
  user-select: none;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

const DeleteButton = styled(Button)`
  background: ${({ theme }) => theme.button.negative.default};
  font-size: 12px;
  padding-inline: 8px;
  padding-block: 4px;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.button.negative.interactive};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'authorization':
        return `
          background-color: ${theme.attention}20;
          color: ${theme.attention};
        `;
      case 'financial':
        return `
          background-color: ${theme.positive}20;
          color: ${theme.positive};
        `;
      case 'future':
        return `
          background-color: ${theme.fade3};
          color: ${theme.text};
        `;
      default:
        return `
          background-color: ${theme.fade2};
          color: ${theme.text};
        `;
    }
  }}
`;
