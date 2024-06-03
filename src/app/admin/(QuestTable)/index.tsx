'use client';

import { useCallback, useMemo, useState } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useDebounceCallback } from 'usehooks-ts';

import EditMenu from '../(EditMenu)';
import TablePagination from './TablePagination';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';
import type {
  Category,
  ColumnMapping,
  Quest,
  TEditMenuOnEditProps,
} from '@/types/quest';

interface QuestTableProps {
  quests: ColumnMapping<Quest>[];
  categories: ColumnMapping<Category>[];
}

const columnMapping: { [key: string]: string } = {
  id: 'ID',
  title: '題目',
  description: '描述',
  category: '題庫',
};

export function QuestTable({ quests, categories }: QuestTableProps) {
  const [updateQuest, deleteQuest] = useQuestStore((state) => [
    state.updateQuest,
    state.deleteQuest,
  ]);

  const handleUpdateQuest = useCallback(
    async (data: TEditMenuOnEditProps) => {
      await updateQuest(data as Quest);
    },
    [updateQuest]
  );

  const globalFilterFn = useCallback<FilterFn<ColumnMapping>>(
    (row, columnId, value, addMeta) => {
      if (typeof value !== 'string') return true;
      const titleRank = rankItem(row.original.title, value);
      const descriptionRank = rankItem(row.original.description, value);
      addMeta(titleRank);
      addMeta(descriptionRank);
      return titleRank.passed || descriptionRank.passed;
    },
    []
  );

  const columns = useMemo<ColumnDef<ColumnMapping>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            題目
            <Icons.chevronsUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => <span>{row.original.title}</span>,
      },
      {
        accessorKey: 'description',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            描述
            <Icons.chevronsUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.description ? row.original.description : '無描述'}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            題庫
            <Icons.chevronsUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.category ? row.original.category : '未加入題庫'}
          </div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <EditMenu
            title={row.original.title}
            content={row.original}
            onEdit={handleUpdateQuest}
            onDelete={deleteQuest}
            categories={categories}
          />
        ),
      },
    ],
    [deleteQuest, handleUpdateQuest, categories]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const debouncedGlobalFilter = useDebounceCallback(setGlobalFilter, 200);

  const table = useReactTable({
    data: quests,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: debouncedGlobalFilter,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          type="text"
          placeholder="關鍵字搜尋"
          value={globalFilter ?? ''}
          onChange={(event) => debouncedGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              選擇顯示 <Icons.chevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnMapping[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn(
                        header.id === 'actions' && 'w-16',
                        header.id === 'title' ? 'text-left' : 'text-center'
                      )}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}

export default QuestTable;
