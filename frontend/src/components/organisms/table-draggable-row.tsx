import { Row } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { CSS } from "@dnd-kit/utilities";
import { z } from "zod";
import { flexRender } from "@tanstack/react-table";

type DraggableRowProps<T extends z.ZodTypeAny> = {
    row: Row<z.infer<T>>;
};

export default function TableDraggableRow<T extends z.ZodTypeAny>({ row }: DraggableRowProps<T>) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}