import {TransactionResponse} from "@/interfaces/transaction-interface";
import {Row} from "@tanstack/react-table";
import {useState} from "react";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {AlertDialogOverlay} from "@radix-ui/react-alert-dialog";
import {useTransactionContext} from "@/contexts/TransactionContext.tsx";
import {showToast} from "@/components/atoms/toastHandler.ts";

interface DeleteTransactionAlertProps {
    row: Row<TransactionResponse>;
}

export default function DeleteTransactionAlert({row}: DeleteTransactionAlertProps) {

    const [loading, setLoading] = useState(false);
    const {deleteTransaction} = useTransactionContext();

    const handleDelete = async () => {
        setLoading(true);
        try {
            deleteTransaction(row.original.id);
            showToast({type: "success", message: "Transacción eliminada."});
        } catch {
            showToast({type: "error", message: "Hubo un error al eliminar la transacción."});
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    aria-expanded={false}
                    className="border-red-200 hover:text-red-200"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <TrashIcon className="text-white"/>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogOverlay className="inset-0 bg-black/50 backdrop-blur-sm z-[1001]"/>
            <AlertDialogContent className="bg-black">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que quieres eliminar?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción y se perderán
                        los datos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            className="text-white"
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
    );
}
