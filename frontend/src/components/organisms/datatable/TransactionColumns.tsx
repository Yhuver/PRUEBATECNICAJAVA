import {ColumnDef} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { TransactionResponse } from "@/interfaces/transaction-interface.ts";
import { TableActions } from "@/components/molecules/TableActions.tsx";
import DragHandle from "@/components/atoms/DragHandle.tsx";


export const getTransactionColumns = ( ): ColumnDef<TransactionResponse>[] => [
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
            const dateUTC = new Date(info.getValue() as string);
            const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const localDate = toZonedTime(dateUTC, clientTimeZone);
            return formatDistanceToNow(localDate, { addSuffix: true, locale: es });
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
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <TableActions row={row} />
        ),
    },
];