import { createContext, useContext, useState, ReactNode, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { TransactionRequest, TransactionResponse, TransactionUpdateRequest } from '@/interfaces/transaction-interface.ts';
import {
    getTransactions,
    addTransaction as createTransaction,
    getTransactionById
} from '@/services/transaction-service.ts';

interface TransactionContextProps {
    transactions: TransactionResponse[];
    addTransaction: (transaction: TransactionRequest) => void;
    editTransaction: (id: number, updatedTransaction: TransactionUpdateRequest) => void;
    deleteTransaction: (id: number) => void;
    isEditOpen: boolean;
    isAddOpen: boolean;
    selectedTransaction: TransactionResponse | null;
    setSelectedTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
    openEditModal: (id: number) => void;
    closeEditModal: () => void;
    openAddModal: () => void;
    closeAddModal: () => void;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const data = await getTransactions();
                if (isMounted.current) {
                    setTransactions(data);
                }
            } catch (error) {
                console.error('Error al cargar las transacciones', error);
            }
        })();
    }, []);

    const addTransaction = async (transaction: TransactionRequest) => {
        try {
            const newTransaction = await createTransaction(transaction);
            setTransactions(prev => [...prev, newTransaction]);
        } catch (error) {
            console.error('Error al agregar la transacción', error);
        }
    };

    const editTransaction = (id: number, updatedTransaction: TransactionUpdateRequest) => {
        setTransactions(prev =>
            prev.map(transaction =>
                transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
            )
        );
    };

    const deleteTransaction = (id: number) => {
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
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
                setSelectedTransaction
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
