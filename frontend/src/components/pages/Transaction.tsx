import { useTransactionContext } from "@/contexts/TransactionContext.tsx";
import { getTransactionColumns } from "@/components/organisms/datatable/TransactionColumns.tsx";
import DataTable from "@/components/organisms/datatable/DataTable.tsx";
import { AddTransactionButton } from "@/components/molecules/AddTransactionButton.tsx";
import AddTransactionModal from "../organisms/transaction/AddTransactionModal";
import EditTransactionModal from "../organisms/transaction/EditTransactionModal";

export default function Transaction() {

    const {
        transactions,
        isAddOpen,
        isEditOpen,
        closeEditModal,
        openAddModal,
        closeAddModal,
    } = useTransactionContext();

    const columns = getTransactionColumns();

    return (
        <div className="space-y-8 rounded-md py-6">
            <div className="flex items-center justify-end px-4 lg:px-6">
                <AddTransactionButton onClick={openAddModal} />
            </div>
            <DataTable
                columns={columns}
                data={transactions}
            />
            <AddTransactionModal
                open={isAddOpen}
                onOpenChange={closeAddModal}
            />
            <EditTransactionModal
                open={isEditOpen}
                onOpenChange={closeEditModal}
            />
        </div>
    );
}
