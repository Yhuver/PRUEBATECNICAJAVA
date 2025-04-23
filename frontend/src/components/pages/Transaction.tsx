import { ColumnDef } from "@tanstack/react-table"
import DataTable from "@/components/organisms/data-table.tsx";
import DragHandle from "@/components/atoms/drag-handle.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import {EditIcon, PlusIcon, TrashIcon} from "lucide-react";
import TransactionModal from "@/components/organisms/transaction-modal.tsx";
import { useState } from "react";
import {toast} from "sonner";


type Transaction = {
    id: number;
    amount: number;
    merchant: string;
    createdAt: string;
};

const columns: ColumnDef<Transaction>[] = [
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
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({ row }) => `$ ${row.original.amount.toFixed(2)}`
    },
    {
        accessorKey: "merchant",
        header: "Giro o comercio"
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de la transación"
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
                    className="border border-red-400 text-red-400 hover:bg-red-50"
                    variant={"outline"}
                    onClick={() => {
                        toast("presionaste borrar")
                    }}
                >
                    <TrashIcon className={"text-red-400"}/>
                </Button>
            </div>
        ),
    },
]

const data = [
    {id: 1, amount: 125.50, merchant: "Supermercado", createdAt: "2025-04-20"},
    { id: 2, amount: 89.99, merchant: "Farmacia Central", createdAt: "2025-04-21" },
    { id: 3, amount: 240.00, merchant: "Ferretería López", createdAt: "2025-04-19" },
    { id: 4, amount: 15.75, merchant: "Panadería El Trigal", createdAt: "2025-04-18" },
    { id: 5, amount: 300.00, merchant: "Tienda Electrónica", createdAt: "2025-04-20" },
    { id: 6, amount: 58.20, merchant: "Cafetería Aroma", createdAt: "2025-04-17" },
    { id: 7, amount: 132.40, merchant: "Librería Estudiantil", createdAt: "2025-04-22" },
    { id: 8, amount: 41.00, merchant: "Verdulería La Huerta", createdAt: "2025-04-21" },
    { id: 9, amount: 199.90, merchant: "Ropa Urbana", createdAt: "2025-04-16" },
    { id: 10, amount: 73.50, merchant: "Carnicería Don Pedro", createdAt: "2025-04-15" },
        // { id: 11, amount: 180.00, merchant: "Zapatería El Paso", createdAt: "2025-04-14" },
        // { id: 12, amount: 22.10, merchant: "Heladería Fresca", createdAt: "2025-04-13" },
        // { id: 13, amount: 390.00, merchant: "Tecnología Smart", createdAt: "2025-04-12" },
        // { id: 14, amount: 65.40, merchant: "Floristería Rosas", createdAt: "2025-04-20" },
        // { id: 15, amount: 99.99, merchant: "Juguetería Mundo Mágico", createdAt: "2025-04-10" },
        // { id: 16, amount: 45.00, merchant: "Pizzería Napoli", createdAt: "2025-04-11" },
        // { id: 17, amount: 120.00, merchant: "Tienda Natural", createdAt: "2025-04-09" },
        // { id: 18, amount: 67.80, merchant: "Papelería Centro", createdAt: "2025-04-08" },
        // { id: 19, amount: 210.60, merchant: "Óptica Visionar", createdAt: "2025-04-07" },
        // { id: 20, amount: 310.00, merchant: "Electrodomésticos Plus", createdAt: "2025-04-06" },
        // { id: 21, amount: 24.75, merchant: "Café La Estación", createdAt: "2025-04-05" },
        // { id: 22, amount: 54.60, merchant: "Panadería El Molino", createdAt: "2025-04-04" },
        // { id: 23, amount: 82.30, merchant: "Verdulería El Campo", createdAt: "2025-04-03" },
        // { id: 24, amount: 175.90, merchant: "Moda Joven", createdAt: "2025-04-02" },
        // { id: 25, amount: 12.00, merchant: "Kiosco 24h", createdAt: "2025-04-01" },
        // { id: 26, amount: 98.70, merchant: "Boutique Elegancia", createdAt: "2025-03-31" },
        // { id: 27, amount: 34.55, merchant: "Mercado de Pulgas", createdAt: "2025-03-30" },
        // { id: 28, amount: 76.00, merchant: "Librería El Saber", createdAt: "2025-03-29" },
        // { id: 29, amount: 143.20, merchant: "Pet Shop Mundo Animal", createdAt: "2025-03-28" },
        // { id: 30, amount: 250.00, merchant: "Auto Repuestos", createdAt: "2025-03-27" },
        // { id: 31, amount: 80.00, merchant: "Cine Centro", createdAt: "2025-03-26" },
        // { id: 32, amount: 62.50, merchant: "Hamburguesería King", createdAt: "2025-03-25" },
        // { id: 33, amount: 145.00, merchant: "Bazar Hogar", createdAt: "2025-03-24" },
        // { id: 34, amount: 33.33, merchant: "Cafetería Java", createdAt: "2025-03-23" },
        // { id: 35, amount: 119.90, merchant: "Sport Zone", createdAt: "2025-03-22" },
        // { id: 36, amount: 299.99, merchant: "TechZone", createdAt: "2025-03-21" },
        // { id: 37, amount: 55.55, merchant: "Papelería Los Andes", createdAt: "2025-03-20" },
        // { id: 38, amount: 38.00, merchant: "Dulcería Encanto", createdAt: "2025-03-19" },
        // { id: 39, amount: 184.00, merchant: "Boutique Urban Style", createdAt: "2025-03-18" },
        // { id: 40, amount: 105.75, merchant: "Carnicería Las Pampas", createdAt: "2025-03-17" },
        // { id: 41, amount: 295.20, merchant: "Muebles Hogar", createdAt: "2025-03-16" },
        // { id: 42, amount: 19.90, merchant: "Heladería Dolce", createdAt: "2025-03-15" },
        // { id: 43, amount: 50.00, merchant: "Kiosco Express", createdAt: "2025-03-14" },
        // { id: 44, amount: 300.00, merchant: "Electrónica World", createdAt: "2025-03-13" },
        // { id: 45, amount: 78.90, merchant: "Ropa Casual", createdAt: "2025-03-12" },
        // { id: 46, amount: 250.00, merchant: "Veterinaria Amigos", createdAt: "2025-03-11" },
        // { id: 47, amount: 88.00, merchant: "Cine Planet", createdAt: "2025-03-10" },
        // { id: 48, amount: 64.40, merchant: "Pizzería Italia", createdAt: "2025-03-09" }
];

export default function  Transaction() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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