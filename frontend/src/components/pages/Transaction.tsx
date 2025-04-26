import { useState} from "react";
import { AddTransactionButton } from "@/components/molecules/AddTransactionButton";
import AddTransactionModal from "@/components/organisms/transaction/AddTransactionModal.tsx";
import DataTable from "@/components/organisms/datatable/DataTable.tsx";
import {getTransactionColumns} from "@/components/organisms/datatable/TransactionColumns.tsx";
import {useTransactions} from "@/hooks/useTransactions.ts";

export default function Transaction() {

    const { loading, fetchData, data } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = getTransactionColumns(fetchData);


    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="space-y-8 rounded-md py-6">
            <div className="flex items-center justify-end px-4 lg:px-6">
                <AddTransactionButton onClick={() => setIsModalOpen(true)} />
            </div>
            <DataTable columns={columns} data={data} />
            <AddTransactionModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                refetchTable={fetchData}
            />
        </div>
    );
}