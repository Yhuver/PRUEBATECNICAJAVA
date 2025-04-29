import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';
import {TransactionRequest, TransactionResponse, TransactionUpdateRequest} from '@/interfaces/transaction-interface.ts';
import {
    createTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction as removeTransaction
} from '@/services/transaction-service.ts';

interface TransactionContextProps {
    transactions: TransactionResponse[];
    addTransaction: (newTransaction: TransactionRequest) => Promise<void>;
    editTransaction: (id: number, updatedTransaction: TransactionUpdateRequest) => Promise<void>;
    deleteTransaction: (id: number) => void;
    isEditOpen: boolean;
    isAddOpen: boolean;
    selectedTransaction: TransactionResponse | null;
    setSelectedTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
    openEditModal: (id: number) => void;
    closeEditModal: () => void;
    openAddModal: () => void;
    closeAddModal: () => void;
    fetchTransactions: () => Promise<void>;
    isFetchError: boolean;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const [isFetchError, setIsFetchError] = useState(false);

    const fetchTransactions = async () => {
        try {
            const transactions = await getTransactions();
            setTransactions(transactions);
            setIsFetchError(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setIsFetchError(true);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await fetchTransactions();
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        })();
    }, []);

    const addTransaction = async (transaction: TransactionRequest): Promise<void> => {
        const newTransaction = await createTransaction(transaction);
        setTransactions(prev => [...prev, newTransaction]);
    };

    const editTransaction = async (id: number, updatedTransaction: TransactionUpdateRequest): Promise<void> => {
        const updatedTrans = await updateTransaction(id, updatedTransaction);
        setTransactions(prev =>
            prev.map(transaction =>
                transaction.id === id ? { ...transaction, ...updatedTrans } : transaction
            )
        );
    };

    const deleteTransaction = async (id: number): Promise<void> => {
        try {
            await removeTransaction(id);
            setTransactions(prev => prev.filter(transaction => transaction.id !== id));
            closeEditModal();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const openEditModal = async (id: number) => {
        const transaction = await getTransactionById(id);
        if (transaction){
            setSelectedTransaction(transaction);
            setIsEditOpen(true);
        }
    };

    const closeEditModal = () => {
        setSelectedTransaction(null);
        setIsEditOpen(false);
    };

    const openAddModal = () => {
        setIsAddOpen(true);
    };

    const closeAddModal = () => {
        setIsAddOpen(false);
    };

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
                editTransaction,
                deleteTransaction,
                isEditOpen,
                isAddOpen,
                selectedTransaction,
                openEditModal,
                closeEditModal,
                openAddModal,
                closeAddModal,
                setSelectedTransaction,
                fetchTransactions,
                isFetchError,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactionContext = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactionContext must be used within a TransactionProvider');
    }
    return context;
};
