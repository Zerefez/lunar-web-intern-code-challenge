import * as React from 'react';
import styled from 'styled-components';
import { useTransactionsQuery } from './get_transactions';

type TransactionsProps = {
  userId: string;
};

export const Transactions = ({ userId }: TransactionsProps) => {
  const { data, loading, error } = useTransactionsQuery({
    variables: {
      userId,
    },
  });

  // TODO: Task #1 – delete authorization mutation
  // const [deleteAuthorization] = useDeleteAuthorizationMutation();

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
            {/* TODO: Task #2 – clicking this header should toggle date sorting */}
            <th>Time ↕️</th>
            <th>Status</th>
            <th>Category</th>
            {/* TODO: Task #1 – header for Delete column */}
            <th></th>
          </tr>
        </StyledTableHeader>
        <tbody>
          {data?.transactions.map(transaction => (
            <StyledTransaction key={transaction.id}>
              <td>
                <img src={transaction.iconURL} alt="" />
              </td>
              <td>{transaction.type}</td>
              <td>{transaction.localizableTitle}</td>
              <td>
                {transaction.billingAmount.amount}
                {transaction.billingAmount.currency}
              </td>
              <td>{transaction.time}</td>
              <td>{transaction.status}</td>
              <td>
                <img src={transaction.categoryIconUrl} alt="" />
              </td>
              {/* TODO: Task #1 – place Delete button here for authorization rows */}
              <td></td>
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
`;

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.surface};
  padding: 16px;
  flex: 1 0 auto;
  border: 1px solid ${({ theme }) => theme.surfaceStroke};
  border-radius: 16px;
`;
