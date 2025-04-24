import {ColumnDef} from "@tanstack/react-table"
import DataTable from "@/components/organisms/data-table.tsx";
import DragHandle from "@/components/molecules/drag-handle.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import { PlusIcon, } from "lucide-react";
import TransactionModal from "@/components/templates/transaction-modal.tsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";
import { getTransactions} from "@/services/transaction-service.ts";
import {formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {TableActions} from "@/components/organisms/table-actions.tsx";


export default function  Transaction() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getTransactions();
            setData(result);
        } catch (err) {
            toast.error("Error al obtener las transacciones: " + (err as string));
        } finally {
            setLoading(false); // Termina el loading
        }
    };

    useEffect(() => {
        const fetchDataAsync = async () => {
            await fetchData();
        };

        fetchDataAsync().catch((error) => {
            console.error(error);
        });
    }, []);

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
            cell: ({ row }) => {
                return <TableActions row={row} refetchTable={fetchData}/>
            }
        }
    ]

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
                refetchTable={fetchData}
            />
        </div>
    );
}