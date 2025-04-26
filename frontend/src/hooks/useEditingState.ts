import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { TransactionResponse } from "@/interfaces/transaction-interface";

export function useEditingState() {
    const [row, setRow] = useState<Row<TransactionResponse> | undefined>(undefined);
    const [isEditOpen, setIsEditOpen] = useState(false);

    function startEditing(rowData: Row<TransactionResponse>) {
        setRow(rowData);
        setIsEditOpen(true);
    }

    function stopEditing() {
        setRow(undefined);
        setIsEditOpen(false);
    }

    return {
        row,
        isEditOpen,
        startEditing,
        stopEditing,
    };
}
