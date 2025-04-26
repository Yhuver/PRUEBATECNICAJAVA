import { TableBody, TableRow, TableCell } from "@/components/ui/table"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import DraggableRow from "@/components/organisms/datatable/DraggableRow.tsx"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Table } from "@tanstack/react-table"

interface TableContentProps<T extends { id: string | number }> {
    table: Table<T>
    dataIds: UniqueIdentifier[]
}

export default function TableContent<T extends { id: string | number }>({ table, dataIds }: TableContentProps<T>) {
    return (
        <TableBody>
            {table.getRowModel().rows.length > 0 ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                    ))}
                </SortableContext>
            ) : (
                <TableRow className="hover:bg-muted/50 even:bg-muted/10 transition-colors">
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        Sin resultados.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}
