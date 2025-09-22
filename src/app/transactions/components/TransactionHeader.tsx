import * as React from 'react';
import styled from 'styled-components';

export type SortOrder = 'asc' | 'desc';
export type SortField = 'date' | 'status' | 'title' | 'amount';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface TransactionHeaderProps {
  sortConfig: SortConfig;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  sortConfig,
  onSortChange,
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
    onSortChange(field, order);
  };

  return (
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
          onChange={handleSelectChange}
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
  );
};

// Header Styles
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
