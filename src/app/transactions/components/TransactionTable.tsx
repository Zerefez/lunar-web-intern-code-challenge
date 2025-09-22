import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../framework/components/Button';
import { Transaction } from '../../../framework/types/types';
import { formatAmount } from '../../../framework/utils/formatAmount';
import { formatDate } from '../../../framework/utils/formatDate';
import { SortField } from './TransactionHeader';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
  onDeleteAuthorization: (transactionId: string) => void;
  onSortChange: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
  deleteLoading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onTransactionClick,
  onDeleteAuthorization,
  onSortChange,
  getSortIcon,
  deleteLoading,
}) => {
  return (
    <StyledCard>
      <StyledTable>
        <StyledTableHeader>
          <tr>
            <th>Icon</th>
            <th>Type</th>
            <th>
              <SortableHeader onClick={() => onSortChange('title')}>
                Title {getSortIcon('title')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => onSortChange('amount')}>
                Amount {getSortIcon('amount')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => onSortChange('date')}>
                Time {getSortIcon('date')}
              </SortableHeader>
            </th>
            <th>
              <SortableHeader onClick={() => onSortChange('status')}>
                Status {getSortIcon('status')}
              </SortableHeader>
            </th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </StyledTableHeader>
        <tbody>
          {transactions.map(transaction => (
            <StyledTransaction 
              key={transaction.id} 
              onClick={() => onTransactionClick(transaction)}
            >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAuthorization(transaction.id);
                    }}
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

// Table Styles
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
  cursor: pointer;
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
