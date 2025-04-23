import {ColumnDef} from "@tanstack/react-table"
import DataTable from "@/components/organisms/data-table.tsx";
import DragHandle from "@/components/atoms/drag-handle.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {EditIcon, PlusIcon, TrashIcon} from "lucide-react";
import TransactionModal from "@/components/organisms/transaction-modal.tsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";
import {getTransactions} from "@/services/transaction-service.ts";
import {formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";


const columns: ColumnDef<TransactionResponse>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "merchant",
        header: "Giro o comercio",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de la transacción",
        cell: info => {
            const createdAt = new Date(info.getValue() as string);
            return formatDistanceToNow(createdAt, {addSuffix: true, locale: es});
        }
    },
    {
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return <div className="font-medium">{formatted + " COP"}</div>
        }
    },
    {
        id: "actions",
        cell: () => (
            <div className={"space-x-2"}>
                <Button
                    variant={"outline"}
                    onClick={() => {
                        toast("presionaste editar")
                    }}
                >
                    <EditIcon/>
                </Button>
                <Button
                    className="border text-red-300 "
                    variant={"outline"}
                    onClick={() => {
                        toast("presionaste borrar")
                    }}
                >
                    <TrashIcon className={"text-red-300"}/>
                </Button>
            </div>
        ),
    }
]

export default function  Transaction() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        void (async () => {
                try {
                    const result = await getTransactions();
                    setData(result)
                }  catch (err) {
                    toast.error(err as string);
                } finally {
                    setLoading(false)
                }
            })();
        }, [])

    if (loading) {
        return <div>Cargando...</div>
    }

    return (
        <div className="space-y-8 rounded-md py-6">
            <div className="flex items-center justify-end px-4 lg:px-6">
                <div className="flex items-center">
                    <Button variant="outline"
                        size="sm"
                        aria-label="Agregar transacción"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusIcon/>
                        <span className="hidden lg:inline">Añadir transacción</span>
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data}/>
            <TransactionModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}