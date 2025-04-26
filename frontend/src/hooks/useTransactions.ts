import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getTransactions } from "@/services/transaction-service";
import { TransactionResponse } from "@/interfaces/transaction-interface";

export function useTransactions() {
    const [data, setData] = useState<TransactionResponse[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getTransactions();
            setData(result);
        } catch (err) {
            toast.error("Error al obtener las transacciones: " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
            .catch((error) => console.error("Error al obtener las transacciones:", error));
    }, []);

    return { data, loading, fetchData };
}