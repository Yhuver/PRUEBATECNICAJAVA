import {TRANSACTION_ROUTE} from "@/constants/routes.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {Banknote} from "lucide-react";
import {useTransactionForm} from "@/hooks/useTransactionForm.ts";
import InputField from "@/components/molecules/InputField.tsx";


interface TransactionFormProps {
    onSuccess: () => void;
    onError?: (msg: string) => void;
}

export default function AddTransactionForm({ onSuccess, onError }: TransactionFormProps ){
    const navigate = useNavigate();

    const {
        register,
        handleSend,
        formState: { errors, isSubmitting },
    } = useTransactionForm({ onSuccess, onError });

    return (
       <form onSubmit={handleSend} className="space-y-8">
           <div className="space-y-6 flex flex-col justify-center items-center">
               <InputField
                   icon={<Banknote className={"text-muted-foreground"}/>}
                   id="amount"
                   label="Valor de la transacción"
                   type="number"
                   placeholder="0"
                   min={0}
                   {...register("amount")}
                   error={errors.amount?.message}
               />
               <InputField
                   id="merchant"
                   label="Motivo de la transacción"
                   placeholder="Motivo de la transacción..."
                   isTextArea
                   {...register("merchant")}
                   error={errors.merchant?.message}
               />
           </div>

           <div className="flex space-x-6 space-y-4">
               <Button type="submit" className="flex-2" disabled={isSubmitting}>
                   {isSubmitting ? "Guardando..." : "Guardar"}
               </Button>
               <Button
                   type="button"
                   variant="outline"
                   className={"flex-1"}
                   onClick={() => navigate(TRANSACTION_ROUTE)}>
                   Cancelar
               </Button>
           </div>
       </form>
   );
}