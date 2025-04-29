import { Button } from "@/components/ui/button.tsx";
import { EditIcon } from "lucide-react";
import { useTransactionContext } from "@/contexts/TransactionContext.tsx";
import { Row } from "@tanstack/react-table";
import { TransactionResponse } from "@/interfaces/transaction-interface.ts";
import DeleteTransactionAlert from "@/components/organisms/transaction/DeleteTransactionAlert.tsx";

interface TableActionsProps {
    row: Row<TransactionResponse>;
}

export function TableActions({ row }: TableActionsProps) {
    const { openEditModal } = useTransactionContext();

    const startEditing = (row: Row<TransactionResponse>) => {
        openEditModal(row.original.id);
    };

    return (
        <div className="space-x-2">
            <Button onClick={() => startEditing(row)}>
                <EditIcon />
            </Button>
            <DeleteTransactionAlert row={row} />
        </div>
    );
}
