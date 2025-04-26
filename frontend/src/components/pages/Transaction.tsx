import { useState} from "react";
import EditTransactionModal from "@/components/organisms/transaction/EditTransactionModal.tsx";
import AddTransactionModal from "@/components/organisms/transaction/AddTransactionModal.tsx";
import {getTransactionColumns} from "@/components/organisms/datatable/TransactionColumns.tsx";
import { AddTransactionButton } from "@/components/molecules/AddTransactionButton.tsx";
import DataTable from "@/components/organisms/datatable/DataTable.tsx";
import {useTransactions} from "@/hooks/useTransactions.ts";
import {useEditingState} from "@/hooks/useEditingState.ts";

export default function Transaction() {

    const { loading, refetchTable, data } = useTransactions();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { row, isEditOpen, startEditing, stopEditing } = useEditingState();

    const columns = getTransactionColumns({refetchTable, startEditing});

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="space-y-8 rounded-md py-6">
            <div className="flex items-center justify-end px-4 lg:px-6">
                <AddTransactionButton onClick={() => setIsAddOpen(true)} />
            </div>
            <DataTable columns={columns} data={data} />
            <AddTransactionModal
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                refetchTable={refetchTable}
            />
            <EditTransactionModal
                open={isEditOpen}
                onOpenChange={stopEditing}
                row={row}
                refetchTable={refetchTable}
            />
        </div>
    );
}