import * as React from 'react';
import styled, { keyframes } from 'styled-components';

export const TransactionSkeleton: React.FC = () => {
  return (
    <SkeletonCard>
      <SkeletonTable>
        <SkeletonTableHeader>
          <tr>
            <th>Icon</th>
            <th>Type</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Time</th>
            <th>Status</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </SkeletonTableHeader>
        <tbody>
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonRow key={index}>
              <td><SkeletonImage /></td>
              <td><SkeletonText width="60px" /></td>
              <td><SkeletonText width="120px" /></td>
              <td><SkeletonText width="80px" /></td>
              <td><SkeletonText width="100px" /></td>
              <td><SkeletonBadge /></td>
              <td><SkeletonImage /></td>
              <td><SkeletonButton /></td>
            </SkeletonRow>
          ))}
        </tbody>
      </SkeletonTable>
    </SkeletonCard>
  );
};

// Animation
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Skeleton Styles
const SkeletonCard = styled.div`
  background-color: ${({ theme }) => theme.surface};
  padding: 24px;
  flex: 1 0 auto;
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.medium};
  overflow: hidden;
`;

const SkeletonTable = styled.table`
  width: 100%;
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
    color: ${({ theme }) => theme.secondaryText};
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

const SkeletonTableHeader = styled.thead`
  th {
    text-align: left;
  }
`;

const SkeletonRow = styled.tr`
  td {
    vertical-align: middle;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, ${({ theme }) => theme.fade1} 0px, ${({ theme }) => theme.fade2} 40px, ${({ theme }) => theme.fade1} 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
`;

const SkeletonText = styled(SkeletonBase)<{ width: string }>`
  height: 16px;
  width: ${({ width }) => width};
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 32px;
  height: 32px;
  border-radius: 6px;
`;

const SkeletonBadge = styled(SkeletonBase)`
  height: 20px;
  width: 80px;
  border-radius: 16px;
`;

const SkeletonButton = styled(SkeletonBase)`
  height: 28px;
  width: 60px;
  border-radius: 6px;
`;
