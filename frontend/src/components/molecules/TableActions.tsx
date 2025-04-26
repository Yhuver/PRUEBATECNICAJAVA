import { Row } from "@tanstack/react-table";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";
import DeleteTransactionAlert from "@/components/organisms/transaction/DeleteTransactionAlert.tsx";
import EditTransactionModal from "@/components/organisms/transaction/EditTransactionModal.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {EditIcon} from "lucide-react";


interface TableActionsProps {
    row: Row<TransactionResponse>;
    refetchTable: () => void;
}

export function TableActions({ row, refetchTable }: TableActionsProps) {

    const [openEdit, setOpenEdit] = useState<boolean>(false);

    const handleOpenEdit = async () => {
        setOpenEdit(!openEdit);
    }

    return (
            <div className="space-x-2">
                <Button
                    onClick={handleOpenEdit}>
                    <EditIcon />
                </Button>
                <DeleteTransactionAlert row={row} refetchTable={refetchTable}/>
                <EditTransactionModal open={openEdit} row={row} refetchTable={refetchTable} onOpenChange={handleOpenEdit}/>
            </div>
    )
}
