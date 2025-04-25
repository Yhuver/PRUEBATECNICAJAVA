import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {toast} from "sonner";
import {EditIcon, TrashIcon} from "lucide-react";
import {useState} from "react";
import {deleteTransaction} from "@/services/transaction-service.ts";
import { Row } from "@tanstack/react-table";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";


interface TableActionsProps {
    row: Row<TransactionResponse>;
    refetchTable: () => void;
}

export function TableActions({ row, refetchTable  }: TableActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteTransaction(row.original.id);
            toast.success("Transacción eliminada");
            refetchTable();
        } catch (err) {
            console.error(err);
            toast.error("Hubo un error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="space-x-2">
                <Button
                    variant="outline"
                    onClick={() => toast("Presionaste editar")}
                >
                    <EditIcon />
                </Button>

                <AlertDialog>
                    <AlertDialogOverlay className={"fixed inset-0 bg-black/50 backdrop-blur-sm z-40"}/>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-white border-red-200 hover:text-red-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <TrashIcon />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres eliminar?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción y se perderán los datos asociados.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    className={"text-white"}
                                    variant="destructive"
                                    disabled={loading}
                                    onClick={handleDelete}
                                >
                                    {loading ? <span className="animate-spin">⏳</span> : "Eliminar"}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
    )
}
