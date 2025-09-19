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

type SortOrder = 'asc' | 'desc';
type SortField = 'date' | 'status' | 'title' | 'amount';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export const Transactions = ({ userId }: TransactionsProps) => {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>(() => {
    const saved = localStorage.getItem('transactions-sort-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { field: 'date', order: 'desc' };
      }
    }
    return { field: 'date', order: 'desc' };
  });
  
  const { data, loading, error } = useTransactionsQuery({
    variables: {
      userId,
    },
  });

  const [deleteAuthorization, { loading: deleteLoading }] = useDeleteAuthorizationMutation({
    optimisticResponse: (variables) => ({
      result: {
        error: null,
        transaction: {
          id: variables.transactionId,
          deleted: new Date().toISOString(),
        } as any,
      },
    }),
    refetchQueries: ['GetTransactions'],
  });

  const processedTransactions = React.useMemo(() => {
    if (!data?.transactions) return [];
    
    return data.transactions
      .filter(transaction => !transaction.deleted)
      .sort((a, b) => {
        let result = 0;
        
        switch (sortConfig.field) {
          case 'date': {
            const dateA = new Date(a.time).getTime();
            const dateB = new Date(b.time).getTime();
            result = dateA - dateB;
            break;
          }
            
          case 'status':
            result = a.status.localeCompare(b.status);
            break;
            
          case 'title':
            result = a.localizableTitle.localeCompare(b.localizableTitle);
            break;
            
          case 'amount':
            result = a.billingAmount.amount - b.billingAmount.amount;
            break;
            
          default:
            result = 0;
        }
        
        return sortConfig.order === 'desc' ? -result : result;
      });
  }, [data?.transactions, sortConfig]);

  const handleDeleteAuthorization = async (transactionId: string) => {
    try {
      await deleteAuthorization({
        variables: { transactionId },
      });
    } catch (error) {
      console.error('Failed to delete authorization:', error);
    }
  };

  const handleSortChange = (field: SortField) => {
    const newConfig: SortConfig = {
      field,
      order: sortConfig.field === field && sortConfig.order === 'desc' ? 'asc' : 'desc'
    };
    setSortConfig(newConfig);
    localStorage.setItem('transactions-sort-config', JSON.stringify(newConfig));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return ' ';
    return sortConfig.order === 'desc' ? '↓' : '↑';
  };

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred 😭</div>;
  }

  return (
    <>
      <PageHeader>
        <HeaderContent>
          <Title>Transactions</Title>
          <Description>
            View and manage your financial transactions.
          </Description>
        </HeaderContent>
        <SortControls>
          <SortLabel>Sort by:</SortLabel>
          <SortSelect 
            value={`${sortConfig.field}-${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
              const newConfig = { field, order };
              setSortConfig(newConfig);
              localStorage.setItem('transactions-sort-config', JSON.stringify(newConfig));
            }}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="status-asc">Status (A-Z)</option>
            <option value="status-desc">Status (Z-A)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </SortSelect>
        </SortControls>
      </PageHeader>
      <StyledCard>
      <StyledTable>
        <StyledTableHeader>
          <tr>
            <th>Icon</th>
            <th>Type</th>
            <th>
              <SortableHeader onClick={() => handleSortChange('title')}>
                Title {getSortIcon('title')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => handleSortChange('amount')}>
                Amount {getSortIcon('amount')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => handleSortChange('date')}>
                Time {getSortIcon('date')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => handleSortChange('status')}>
                Status {getSortIcon('status')}
              </SortableHeader>
            </th>
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
                 <AmountCell amount={transaction.billingAmount.amount}>
                   {formatAmount(transaction.billingAmount.amount, transaction.billingAmount.currency)}
                 </AmountCell>
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
    </>
  );
};



const StyledTable = styled.table`
  width: 100%;
  position: relative;
  border-collapse: separate;
  border-spacing: 0;

  td,
  th {
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.fade2};
  }

  th {
    background-color: ${({ theme }) => theme.fade1};
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  th:first-child {
    border-top-left-radius: 8px;
  }

  th:last-child {
    border-top-right-radius: 8px;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const StyledTableHeader = styled.thead`
  color: ${({ theme }) => theme.secondaryText};

  th {
    text-align: left;
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

const StyledTransaction = styled.tr`
  transition: all 0.2s ease;
  
  img {
    height: 32px;
    width: 32px;
    border-radius: 6px;
    object-fit: cover;
  }

  td {
    vertical-align: middle;
    font-size: 14px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fade1};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.small};
  }

  &:nth-child(even) {
    background-color: ${({ theme }) => theme.fade0}50;
  }

  &:nth-child(even):hover {
    background-color: ${({ theme }) => theme.fade1};
  }
`;

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.surface};
  padding: 24px;
  flex: 1 0 auto;
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.medium};
  overflow: hidden;
`;

const SortableHeader = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 4px 8px;
  margin: -4px -8px;
  text-align: left;
  user-select: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  
  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.fade1};
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

const DeleteButton = styled(Button)`
  background: ${({ theme }) => theme.button.negative.default};
  font-size: 11px;
  font-weight: 600;
  padding-inline: 12px;
  padding-block: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px ${({ theme }) => theme.button.negative.default}20;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.button.negative.interactive};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${({ theme }) => theme.button.negative.default}30;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px ${({ theme }) => theme.button.negative.default}20;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  min-width: 80px;
  justify-content: center;
  
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

const AmountCell = styled.span<{ amount: number }>`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  
  ${({ amount, theme }) => 
    amount < 0 
      ? `color: ${theme.negative};` 
      : `color: ${theme.positive};`
  }
`;

const PageHeader = styled.header`
  margin-bottom: 24px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.small};
  
  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const HeaderContent = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  line-height: 1.2;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  margin: 0 0 16px 0;
  line-height: 1.4;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

const SortLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.secondaryText};
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.fade2};
  border-radius: 6px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary}40;
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    width: 100%;
  }
`;
