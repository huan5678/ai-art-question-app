'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { ChevronDown, Minus, Plus, Trash2 } from 'lucide-react';

import { deleteBoardAction } from '@/action/project-action';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
const TaskList = ({ board, children, onEdit, length }) => {
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(true);
  async function onAction(id) {
    await deleteBoardAction(id);
  }
  const { name, status, id } = board;
  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onAction(board.id)}
      />
      <div
        className={cn('mt-8   rounded-l-xl border-l-2', {
          'border-l-primary': status === 'primary',
          'border-l-warning': status === 'warning',
          'border-l-success': status === 'success',
        })}
      >
        <div
          className={cn(
            'flex   max-w-[306px] cursor-pointer     items-center gap-2 border p-4',
            {
              'rounded-t-xl border-b-0 ': show,
              ' rounded-xl': !show,
            }
          )}
          onClick={() => setShow(!show)}
        >
          <span
            className={cn(
              'text-default-700 transition-transform duration-300',
              {
                '-rotate-90': !show,
              }
            )}
          >
            <ChevronDown className="size-4 " />
          </span>

          <span className="text-default-800 flex-1 font-semibold capitalize">
            {name} {length}
          </span>
          <button type="button">
            {show ? <Plus className="size-4 " /> : <Minus className="size-4" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Icon
                icon="heroicons:ellipsis-horizontal-16-solid"
                className="size-4 cursor-pointer"
              />
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
        </div>

        <Collapsible open={show} onOpenChange={setShow}>
          <CollapsibleContent className="CollapsibleContent">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
};

export default TaskList;
