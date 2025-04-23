import { TableHead, TableRow, TableHeader as TableHeaderS } from "@/components/ui/table.tsx"
import { flexRender, Table } from "@tanstack/react-table"

interface TableContentProps<T extends { id: string | number }> {
    table: Table<T>
}

export default function DataTableHeader<T extends { id: string | number }>({ table }: TableContentProps<T>) {
    return (
        <TableHeaderS className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead
                            className="text-center"
                            key={header.id}
                            colSpan={header.colSpan}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                        </TableHead>
                    ))}
                </TableRow>
            ))}
        </TableHeaderS>
    )
}
