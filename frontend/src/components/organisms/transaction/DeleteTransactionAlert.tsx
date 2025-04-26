import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TrashIcon} from "lucide-react";
import {deleteTransaction} from "@/services/transaction-service.ts";
import {toast} from "sonner";
import {useState} from "react";
import {Row} from "@tanstack/react-table";
import {TransactionResponse} from "@/interfaces/transaction-interface.ts";


interface TransactionEditModalProps {
    row: Row<TransactionResponse>;
    refetchTable: () => void;
}

export default function DeleteTransactionAlert ({ row , refetchTable}: TransactionEditModalProps){
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="bg-[#8E1616] hover:bg-[#BB3C3C] border-red-200 hover:text-red-200"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <TrashIcon className={"text-white"} />
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
    )
}