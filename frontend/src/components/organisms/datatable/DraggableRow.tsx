import { Row } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { CSS } from "@dnd-kit/utilities";
import { z } from "zod";
import { flexRender } from "@tanstack/react-table";
import {cn} from "@/lib/utils.ts";

type DraggableRowProps<T extends z.ZodTypeAny> = {
    row: Row<z.infer<T>>;
};

export default function DraggableRow<T extends z.ZodTypeAny>({ row }: DraggableRowProps<T>) {

    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className={cn(
                "hover:bg-muted/50 transition-colors",
                "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            )}
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