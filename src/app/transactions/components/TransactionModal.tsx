import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../framework/components/Button';
import { Transaction } from '../../../framework/types/types';
import { formatAmount } from '../../../framework/utils/formatAmount';
import { formatDate } from '../../../framework/utils/formatDate';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (transactionId: string) => void;
  deleteLoading: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onDelete,
  deleteLoading,
}) => {
  if (!transaction) return null;

  const handleDelete = () => {
    onDelete(transaction.id);
    onClose();
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Transaction Details</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <DetailRow>
            <DetailLabel>Transaction ID:</DetailLabel>
            <DetailValue>{transaction.id}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Title:</DetailLabel>
            <DetailValue>{transaction.localizableTitle}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Type:</DetailLabel>
            <DetailValue style={{ textTransform: 'capitalize' }}>{transaction.type}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Status:</DetailLabel>
            <DetailValue>
              <StatusBadge status={transaction.status}>
                {transaction.status}
              </StatusBadge>
            </DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Amount:</DetailLabel>
            <DetailValue>
              <AmountCell amount={transaction.billingAmount.amount}>
                {formatAmount(transaction.billingAmount.amount, transaction.billingAmount.currency)}
              </AmountCell>
            </DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Date & Time:</DetailLabel>
            <DetailValue>{formatDate(transaction.time)}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Category:</DetailLabel>
            <DetailValue style={{ textTransform: 'capitalize' }}>{transaction.categoryID}</DetailValue>
          </DetailRow>
          
          {transaction.transactionAmount && (
            <DetailRow>
              <DetailLabel>Original Amount:</DetailLabel>
              <DetailValue>
                {formatAmount(transaction.transactionAmount.amount, transaction.transactionAmount.currency)}
              </DetailValue>
            </DetailRow>
          )}
        </ModalBody>
        
        {transaction.status === 'authorization' && (
          <ModalFooter>
            <DeleteButton
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Transaction'}
            </DeleteButton>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

// Modal Styles
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.large};
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.fade2};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.secondaryText};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.fade1};
    color: ${({ theme }) => theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid ${({ theme }) => theme.fade2};
  display: flex;
  justify-content: flex-end;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.fade1};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.secondaryText};
  flex: 1;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-align: right;
  flex: 1;
  word-break: break-all;
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
