import { Table } from "@/components/ui/table.tsx"
import { useDataTable } from "@/hooks/useDataTable.tsx"
import { closestCenter, DndContext } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { ColumnDef } from "@tanstack/react-table"
import TableHeader from "@/components/molecules/TableHeader.tsx";
import TableContent from "@/components/molecules/TableContent.tsx";
import TablePagination from "@/components/molecules/TablePagination.tsx";

type RowWithId = { id: number }

export default function DataTable<T extends RowWithId>({ columns, data: initialData }: { columns: ColumnDef<T>[]; data: T[] }) {

    const {
        table,
        dataIds,
        sensors,
        sortableId,
        handleDragEnd,
        selectedCount,
        totalCount,
    } = useDataTable(initialData, columns)

    const pageSizes = [10, 20, 30, 40, 50];

    return (
        <div className="relative flex flex-col gap-4 overflow-auto space-y-6 px-4 lg:px-6">
            <div className="overflow-hidden rounded-lg border">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader table={table} />
                        <TableContent table={table} dataIds={dataIds} />
                    </Table>
                </DndContext>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {selectedCount} de {totalCount} fila(s) seleccionada(s).
                </div>
                <TablePagination pageSizes={pageSizes} table={table} />
            </div>
        </div>
    )
}
