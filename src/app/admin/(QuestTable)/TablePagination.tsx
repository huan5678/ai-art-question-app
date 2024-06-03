import type { Table } from '@tanstack/react-table';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnMapping } from '@/types/quest';

const TablePagination = ({ table }: { table: Table<ColumnMapping> }) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="me-auto">
        <span className="px-2">
          第 {table.getState().pagination.pageIndex + 1} /{' '}
          {table.getPageCount()} 頁
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <Icons.chevronFirst className="size-4" />
        </Button>
        {table.getState().pagination.pageIndex - 2 >= 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 2)
            }
          >
            {table.getState().pagination.pageIndex - 1}
          </Button>
        )}
        {table.getCanPreviousPage() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
            }
          >
            {table.getState().pagination.pageIndex}
          </Button>
        )}
        <Button variant="outline" size="sm" disabled>
          {table.getState().pagination.pageIndex + 1}
        </Button>
        {table.getCanNextPage() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
            }
          >
            {table.getState().pagination.pageIndex + 2}
          </Button>
        )}
        {table.getState().pagination.pageIndex + 2 < table.getPageCount() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 2)
            }
          >
            {table.getState().pagination.pageIndex + 3}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <Icons.chevronLast className="size-4" />
        </Button>
      </div>
      <Select
        onValueChange={(pageSize) => table.setPageSize(Number(pageSize))}
        defaultValue={table.getState().pagination.pageSize.toString()}
      >
        <SelectTrigger className="flex max-w-24 items-center">
          <SelectValue
            placeholder={`行數: ${table.getState().pagination.pageSize}`}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>顯示數量</SelectLabel>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
export default TablePagination;
