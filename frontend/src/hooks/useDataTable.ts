import {useId, useState} from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
} from "@tanstack/react-table"
import {
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

type RowWithId = { id: string | number }

export function useDataTable<T extends RowWithId>(initialData: T[], columns: ColumnDef<T>[]) {
    const [data, setData] = useState(() => initialData)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const sortableId = useId()

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    const dataIds = data.map(item => item.id)

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            const oldIndex = dataIds.indexOf(active.id)
            const newIndex = dataIds.indexOf(over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                setData((data) => arrayMove(data, oldIndex, newIndex))
            }
        }
    }

    return {
        table,
        dataIds,
        sensors,
        sortableId,
        handleDragEnd,
        selectedCount: table.getFilteredSelectedRowModel().rows.length,
        totalCount: table.getFilteredRowModel().rows.length,
    }
}

