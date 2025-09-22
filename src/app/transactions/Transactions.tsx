import * as React from 'react';
import { Transaction } from '../../framework/types/types';
import {
  AppState,
  SortConfig,
  SortField,
  SortOrder,
  Toast,
  TransactionHeader,
  TransactionModal,
  TransactionSkeleton,
  TransactionTable
} from './components';
import { useDeleteAuthorizationMutation } from './delete_authorization';
import { useTransactionsQuery } from './get_transactions';

type TransactionsProps = {
  userId: string;
};

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

  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  
  const { data, loading, error, refetch } = useTransactionsQuery({
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

  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDeleteAuthorization = async (transactionId: string) => {
    try {
      setDeleteError(null);
      await deleteAuthorization({
        variables: { transactionId },
      });
    } catch (error) {
      console.error('Failed to delete authorization:', error);
      setDeleteError('Failed to delete transaction');
    }
  };

  const handleSortChange = (field: SortField, order?: SortOrder) => {
    const newConfig: SortConfig = {
      field,
      order: order || (sortConfig.field === field && sortConfig.order === 'desc' ? 'asc' : 'desc')
    };
    setSortConfig(newConfig);
    localStorage.setItem('transactions-sort-config', JSON.stringify(newConfig));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return ' ';
    return sortConfig.order === 'desc' ? '↓' : '↑';
  };

  const handleRetry = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refetch transactions:', error);
    }
  };

  // Handle different states
  if (loading && !data) {
    return (
      <>
        <TransactionHeader sortConfig={sortConfig} onSortChange={handleSortChange} />
        <TransactionSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TransactionHeader sortConfig={sortConfig} onSortChange={handleSortChange} />
        <AppState type="error" message="Failed to load transactions" onRetry={handleRetry} />
      </>
    );
  }

  if (processedTransactions.length === 0) {
    return (
      <>
        <TransactionHeader sortConfig={sortConfig} onSortChange={handleSortChange} />
        <AppState type="empty" />
      </>
    );
  }

  return (
    <>
      <TransactionHeader 
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
      />
      
      <TransactionTable
        transactions={processedTransactions}
        onTransactionClick={setSelectedTransaction}
        onDeleteAuthorization={handleDeleteAuthorization}
        onSortChange={(field) => handleSortChange(field)}
        getSortIcon={getSortIcon}
        deleteLoading={deleteLoading}
      />
      
      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onDelete={handleDeleteAuthorization}
        deleteLoading={deleteLoading}
      />
      
      <Toast 
        message={deleteError}
        onClose={() => setDeleteError(null)}
      />
    </>
  );
};
