import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function AddTransactionButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            variant="outline"
            size="sm"
            aria-label="Agregar transacción"
            onClick={onClick}
        >
            <PlusIcon />
            <span className="hidden lg:inline">Añadir transacción</span>
        </Button>
    );
}