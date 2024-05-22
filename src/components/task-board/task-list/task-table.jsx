'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { faker } from '@faker-js/faker';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { z } from 'zod';

import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from '@/action/project-action';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
const members = [
  {
    name: 'Nick Jonas',
    value: 'userid1',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Fahim',
    value: 'userid2',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Nayeem',
    value: 'userid3',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Iftekhar',
    value: 'userid4',
    image: faker.image.avatarLegacy(),
  },
];
const tabs = [
  {
    label: 'Due Date',
    value: 'due-date',
  },
  {
    label: 'Start Date',
    value: 'start-date',
  },
];

const priorityColors = {
  high: 'success',
  medium: 'warning',
  low: 'destructive',
};

const schema = z.object({
  title: z.string().min(2, { message: 'Need Task Title' }),
});

const TaskTable = ({ data, boards, onUpdateTask, boardID2 }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dueDate, setDueDate] = React.useState(new Date());
  const [startDate, setStartDate] = React.useState(new Date());
  // for delete action state
  const [open, setOpen] = React.useState(false);

  // create task
  const [isPending, startTransition] = React.useTransition();
  const getBoardNameById = (boardId) => {
    const foundBoard = boards.find((board) => board.id === boardId);
    return foundBoard ? foundBoard.name : 'Unknown Board';
  };
  const handleMoveTask = (task, boardId) => {
    const newData = {
      ...task,
      boardId: boardId,
    };
    updateTaskAction(task.id, newData);
  };

  const onAction = async (dltId) => {
    await deleteTaskAction(dltId);
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    data.boardId = boardID2;
    var result;

    startTransition(async () => {
      result = await addTaskAction(data);
      toast.success('Successfully added');
    });

    reset();
  };

  const columns = [
    {
      id: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rtl:mr-4"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rtl:mr-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'title',
      header: 'Task',
      cell: ({ row }) => (
        <div
          className="flex max-w-[300px] cursor-pointer items-center gap-2 text-ellipsis"
          onClick={() => onUpdateTask(row?.original)}
        >
          <div className="text-default-800 flex-1 truncate text-sm font-medium capitalize">
            {row.getValue('title')} {boardID2}
          </div>
          <div className="bg-default-100 text-default-600 rounded-sm px-2 text-[10px] font-semibold">
            {row.original?.tag}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="soft"
                className="flex h-6 items-center gap-1 whitespace-nowrap  text-sm font-medium"
              >
                {getBoardNameById(row?.original.boardId)}{' '}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[50px]" align="start">
              {boards?.map((board) => (
                <DropdownMenuItem
                  onSelect={() => handleMoveTask(row.original, board.id)}
                  className="text-default-600 py-1 text-[10px]  font-semibold leading-[14px]"
                  key={`key-dropdown-${board.id}`}
                >
                  {board.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },

    {
      accessorKey: 'list',
      header: 'List',
      cell: ({ row }) => (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="soft"
                className="flex h-6 items-center gap-1 whitespace-nowrap  text-sm font-medium"
              >
                UI/UX Design <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div className="bg-default-50 border-default-300 flex items-center  justify-between border-b px-3 py-2 ">
                <div className=" text-default-900 text-sm font-medium ">
                  Task List{' '}
                </div>
                <PopoverClose>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-default-400 size-6 rounded-full"
                  >
                    <X className="size-4" />
                  </Button>
                </PopoverClose>
              </div>
              <Command>
                <div className="p-2">
                  <CommandInput
                    placeholder="Search list..."
                    inputWrapper="border border-default-200 rounded-md"
                    className="h-9"
                  ></CommandInput>
                </div>
                <CommandEmpty>No Item found</CommandEmpty>
                <CommandGroup>
                  {row.getValue('list')?.map((item, index) => (
                    <CommandItem key={`assigned-list-item-${index}`}>
                      {item.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-default-600 border-default-200 hover:bg-default-50 hover:decoration-primary cursor-pointer border-b px-4 py-1.5 text-sm font-medium hover:underline">
                    Create a list
                  </div>
                </DialogTrigger>
                <DialogContent size="lg" className="px-0">
                  <DialogHeader className="border-default-300 border-b">
                    <div className="text-default-900 pb-4 text-center text-lg font-medium">
                      Create a list
                    </div>
                  </DialogHeader>

                  <div className="p-4">
                    <Label htmlFor="listname" className="mb-2">
                      List Name
                    </Label>
                    <Input type="text" placeholder="example list.." />
                  </div>
                  <DialogFooter className=" px-4 sm:justify-center">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
    {
      accessorKey: 'assign',
      header: 'Assigns',
      cell: ({ row }) => (
        <div>
          {row.getValue('assign')?.length > 0 && (
            <div className="flex items-center gap-3">
              <AvatarGroup
                max={2}
                total={row.getValue('assign').length}
                countClass="w-8 h-8"
              >
                {row.getValue('assign').map((user) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="ring-background ring-offset-background size-8 ring-1 ring-offset-2">
                          <AvatarImage src={user.image.src} />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent color="primary">
                        <p>{user.name}</p>
                        <TooltipArrow className=" fill-primary" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AvatarGroup>
              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-default-100 hover:bg-default-200 size-8 rounded-full"
                  >
                    <Icon
                      icon="heroicons:user-plus"
                      className="text-primary size-5"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <div className="bg-default-50 border-default-300 flex items-center  justify-between border-b px-3 py-2">
                    <div className=" text-default-900 text-sm font-medium ">
                      Assign Task To
                    </div>
                    <PopoverClose>
                      <Button
                        type="button"
                        size="icon"
                        className="bg-default-400 size-6 rounded-full"
                      >
                        <X className="size-4" />
                      </Button>
                    </PopoverClose>
                  </div>
                  <Command>
                    <div className="p-2">
                      <CommandInput
                        placeholder="Search By Name..."
                        inputWrapper="border border-default-200 rounded-md"
                        className="h-9"
                      ></CommandInput>
                    </div>
                    <CommandEmpty>No new members.</CommandEmpty>
                    <CommandGroup>
                      {members.map((item) => (
                        <CommandItem
                          key={`assigned-members-${item.value}`}
                          value={item.name}
                          className="gap-2"
                        >
                          <Avatar className="size-8">
                            <AvatarImage src={item.image} />
                            <AvatarFallback>SN</AvatarFallback>
                          </Avatar>
                          <span className="font-base text-default-900 capitalize">
                            {item.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Due Date',
      cell: ({ row }) => (
        <div>
          <Popover>
            <PopoverTrigger>
              <Button
                type="button"
                className="text-default-600 whitespace-nowrap bg-transparent font-medium hover:bg-transparent"
              >
                {row.getValue('date')} /{row?.original?.time}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="bottom">
              <Tabs defaultValue="due-date" className="block">
                <TabsList className="grid h-12 w-full grid-cols-2 py-2">
                  {tabs.map((item) => (
                    <TabsTrigger
                      key={`date-item-${item.value}`}
                      value={item.value}
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="due-date">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    className=" w-full"
                  />
                </TabsContent>
                <TabsContent value="start-date">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className=" w-full"
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2 p-2.5">
                <PopoverClose>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </PopoverClose>
                <Button size="sm">Select</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <div>
          {row.getValue('priority') ? (
            <Badge
              color={priorityColors[row.getValue('priority')] || ''}
              className="capitalize"
            >
              {row.getValue('priority')}
            </Badge>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="soft"
                  className="text-primary hover:text-primary h-6 bg-transparent text-sm font-medium hover:bg-transparent"
                >
                  Add...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[196px]" align="start">
                <DropdownMenuItem>High</DropdownMenuItem>
                <DropdownMenuItem>Low</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>urgent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'storyPoints',
      header: 'Story Point',
      cell: ({ row }) => (
        <div>
          {row.getValue('storyPoints') ? (
            row.getValue('storyPoints')
          ) : (
            <input
              type="text"
              placeholder="Set"
              className="border-default-200 w-16 border-b focus:outline-none"
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <>
            <DeleteConfirmationDialog
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={() => onAction(row.original.id)}
            />
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="size-7"
                color="secondary"
                onClick={() => setOpen(true)}
              >
                <Icon icon="heroicons:trash" className=" size-4  " />
              </Button>
              <Button
                size="icon"
                variant="outline"
                color="secondary"
                className=" size-7 "
                onClick={() => onUpdateTask(row?.original)}
              >
                <Icon icon="heroicons:pencil" className=" size-4  " />
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="border-default-300 overflow-x-auto rounded-bl-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-default-300 whitespace-nowrap border-r  first:border-r-0 rtl:text-right"
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
                  key={`row-${row.id}`}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-default-300 border "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={`cell-${cell.id}`}
                      className="border-default-300 border-r py-2.5 first:border-r-0"
                    >
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
            <TableRow>
              <TableCell
                className="border-default-300 border-r py-2.5 first:border-r-0"
                colSpan={columns.length / 2}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center">
                    <Plus className="text-primary size-4" />
                    <input
                      type="text"
                      {...register('title')}
                      placeholder={
                        errors.title ? errors.title.message : 'Add a task'
                      }
                      className={cn(
                        'text-default-900 placeholder:text-primary pl-2 text-sm font-medium focus:outline-none',
                        {
                          ' placeholder:text-destructive  text-destructive ':
                            errors.title,
                        }
                      )}
                    />
                  </div>
                </form>
              </TableCell>
              <TableCell
                className="border-default-300 border-r py-2.5 first:border-r-0"
                colSpan={columns.length / 2}
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TaskTable;
