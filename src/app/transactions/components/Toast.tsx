import * as React from 'react';
import styled from 'styled-components';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <ToastContainer>
      <span>❌ {message}</span>
      {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.button.negative.default};
  color: ${({ theme }) => theme.textInvert};
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textInvert};
  cursor: pointer;
  padding: 0;
  font-size: 18px;
`;
