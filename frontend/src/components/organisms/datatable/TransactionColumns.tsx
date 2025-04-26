import {ColumnDef, Row} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { TransactionResponse } from "@/interfaces/transaction-interface.ts";
import { TableActions } from "@/components/molecules/TableActions.tsx";
import DragHandle from "@/components/atoms/DragHandle.tsx";


interface TransactionColumnsProps {
    refetchTable: () => void;
    startEditing: (row: Row<TransactionResponse> ) => void;
}

export const getTransactionColumns = ( {refetchTable, startEditing }: TransactionColumnsProps): ColumnDef<TransactionResponse>[] => [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "merchant",
        header: "Giro o comercio",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de la transacción",
        cell: (info) => {
            const createdAt = new Date(info.getValue() as string);
            return formatDistanceToNow(createdAt, { addSuffix: true, locale: es });
        },
    },
    {
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="font-medium">{formatted + " COP"}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <TableActions
                row={row}
                refetchTable={refetchTable}
                startEditing={startEditing}
            />
        ),
    },
];