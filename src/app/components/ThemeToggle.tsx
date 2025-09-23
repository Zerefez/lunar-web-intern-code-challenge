import * as React from 'react';
import styled from 'styled-components';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <ToggleButton onClick={onToggle} isDark={isDark}>
      <ToggleIcon>{isDark ? '🌙' : '☀️'}</ToggleIcon>
    </ToggleButton>
  );
};

const ToggleButton = styled.button<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  width: 100%;
  background: ${({ theme }) => theme.fade1};
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  font-weight: 500;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.fade2};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ToggleIcon = styled.span`
  font-size: 20px;
`;
