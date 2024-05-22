'use client';
import React, { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
// dnd
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';
import { Loader2, MoreHorizontal, Plus, Trash2, UserPlus } from 'lucide-react';

import Task from './task';

import { deleteBoardAction } from '@/action/project-action';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const taskBoard = ({
  board,
  children,
  onEdit,
  taskHandler,
  isTaskOpen,
  showButton,
  tasks,
  onUpdateTask,
  boards,
}) => {
  const [open, setOpen] = React.useState(false);

  async function onAction(id) {
    await deleteBoardAction(id);
  }
  const { name, status, id } = board;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'Column',
      board,
    },
    disabled: isTaskOpen,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onAction(board.id)}
      />
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          'bg-default-100 dark:bg-default-50 w-full  max-w-[277px] flex-none  rounded-md border-t-4 shadow-lg ',
          {
            'border-primary': status === 'primary',
            'border-warning': status === 'warning',
            'border-success': status === 'success',
            'opacity-50': isDragging,
          }
        )}
      >
        <CardHeader
          {...listeners}
          className="border-default-200 mb-0 flex-row items-center justify-between space-y-0 rounded-sm border-b px-3 py-2.5"
        >
          <div className="flex items-center">
            <Button
              type="button"
              size="icon"
              className="text-primary/80 border-default-200 size-5 rounded-sm border bg-transparent hover:bg-transparent"
            >
              <UserPlus className="size-3" />
            </Button>
          </div>
          <div className="text-default-800 text-sm font-semibold capitalize">
            {name}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="hover:bg-default-200 size-8 rounded-full bg-transparent"
              >
                <MoreHorizontal className="text-default-900 size-4 cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="end">
              <DropdownMenuItem onSelect={() => onEdit(board)}>
                <Icon
                  icon="heroicons:pencil-square"
                  className="text-default-700 mr-1 size-3.5"
                />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                <Trash2 className="text-default-600 mr-1 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {/* main content  */}
        <CardContent className="px-0 pb-0">
          {/* all tasks */}
          <div className="h-[calc(100vh-300px)]">
            <ScrollArea className="h-full">
              <div className="space-y-3 p-3">{children}</div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="w-full px-3 pb-2">
          {showButton && (
            <Button
              className="flex w-full items-center justify-center gap-1 bg-transparent hover:bg-transparent"
              onClick={() => taskHandler(id)}
            >
              <Plus className="text-primary size-5" />
              <span className="text-primary text-xs font-semibold">
                Add Task
              </span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default taskBoard;
