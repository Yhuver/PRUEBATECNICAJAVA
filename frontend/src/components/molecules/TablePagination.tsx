import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon} from "lucide-react";
import {Table} from "@tanstack/react-table";

interface TablePaginationProps<T> {
    table: Table<T>
    pageSizes: number[];
}

export default function TablePagination<T>({ table, pageSizes }: TablePaginationProps<T>){
    return (

        <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Cantidad
                </Label>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="w-20" id="rows-per-page">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {pageSizes.map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
                Página {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">Ir al primero</span>
                    <ChevronsLeftIcon />
                </Button>
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeftIcon />
                </Button>
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRightIcon />
                </Button>
                <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">Anterior</span>
                    <ChevronsRightIcon />
                </Button>
            </div>
        </div>
    );
}