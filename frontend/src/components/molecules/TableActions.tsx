import { Row } from "@tanstack/react-table";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";
import DeleteTransactionAlert from "@/components/organisms/transaction/DeleteTransactionAlert.tsx";
import {Button} from "@/components/ui/button.tsx";
import {EditIcon} from "lucide-react";


interface TableActionsProps {
    row: Row<TransactionResponse>;
    refetchTable: () => void;
    startEditing: (row: Row<TransactionResponse>) => void;
}

export function TableActions({ row, refetchTable, startEditing }: TableActionsProps) {
    return (
            <div className="space-x-2">
                <Button onClick={()=> startEditing(row)}>
                    <EditIcon />
                </Button>
                <DeleteTransactionAlert row={row} refetchTable={refetchTable}/>
            </div>
    )
}
