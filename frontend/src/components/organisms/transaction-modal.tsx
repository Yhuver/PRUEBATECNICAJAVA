import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import InputField from "@/components/molecules/input-label.tsx";
import { useNavigate } from "react-router-dom";
import ModalSkeleton from "@/components/molecules/modal-skeleton.tsx";
import {Banknote} from "lucide-react";
import {TRANSACTION_ROUTE} from "@/constants/routes.ts";

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOpenRegister = () => {
            onOpenChange(true);
        };

        document.addEventListener("open-add-transaction", handleOpenRegister);
        return () => {
            document.removeEventListener("open-add-transaction", handleOpenRegister);
        };
    }, [onOpenChange]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            navigate(TRANSACTION_ROUTE);
        }, 1000);
    };

    return (
        <ModalSkeleton
            open={open}
            onOpenChange={onOpenChange}
            title="Añadir Transacción"
            description="Agrega los detalles de la nueva transacción"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6 flex flex-col justify-center items-center">
                    <InputField
                        icon={<Banknote className={"text-muted-foreground"}/>}
                        id="amount"
                        label="Valor de la transacción"
                        type="number"
                        placeholder="0.00"
                        min={0}
                    />
                    <InputField
                        id="merchant"
                        label="Motivo de la transacción"
                        placeholder="Para comprar..."
                        isTextArea
                    />
                </div>

                <div className="flex space-x-6 space-y-4">
                    <Button type="submit" className="flex-2" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar"}
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
        </ModalSkeleton>
    );
}
