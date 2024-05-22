'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import {
  Calendar,
  ChevronDown,
  Link,
  List,
  MoreHorizontal,
} from 'lucide-react';
import Image from 'next/image';

import AssignMembers from './common/assign-members';

import { deleteTaskAction, updateTaskAction } from '@/action/project-action';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getWords } from '@/lib/utils';
import { cn } from '@/lib/utils';

const prioritiesColorMap = {
  high: 'success',
  low: 'destructive',
  medium: 'warning',
};

const tagsColorMap = {
  development: 'destructive',
  planning: 'info',
  design: 'success',
  'ui/ux': 'warning',
};
// dnd
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, onUpdateTask, boards }) => {
  const [open, setOpen] = React.useState(false);
  const {
    id,
    tags,
    title,
    desc,
    priority,
    status,
    version,
    assign,
    image,
    category,
    pages,
    messageCount,
    link,
    date,
    time,
  } = task;

  const handleMoveTask = (task, boardId) => {
    const newData = {
      ...task,
      boardId: boardId,
    };
    updateTaskAction(task.id, newData);
  };

  const getBoardNameById = (boardId) => {
    const foundBoard = boards.find((board) => board.id === boardId);
    return foundBoard ? foundBoard.name : 'Unknown Board';
  };
  // delete task
  const onAction = async (dltId) => {
    await deleteTaskAction(dltId);
  };
  // dnd
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: false,
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
        onConfirm={() => onAction(id)}
      />
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          'border-default-200  group  relative cursor-pointer p-3 shadow',
          {
            'opacity-50': isDragging,
          }
        )}
        onClick={() => onUpdateTask(task)}
      >
        <CardHeader className="mb-0 flex-row items-center justify-between space-x-0 space-y-0 border-none p-0">
          <div className="flex items-center gap-1">
            <div className="text-default-600 border-default-200 rounded-sm border px-1.5 text-[10px] font-semibold uppercase  leading-[14px]">
              {getWords(title)}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="text-default-600 border-default-200 flex  items-center justify-center gap-[2px] rounded-sm  border px-1.5 text-[10px] font-semibold leading-[14px]">
                    {getBoardNameById(task.boardId)}
                    <ChevronDown className="size-3" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[50px]" align="start">
                  {boards?.map((board) => (
                    <DropdownMenuItem
                      onSelect={() => handleMoveTask(task, board.id)}
                      className="text-default-600 py-1 text-[10px]  font-semibold leading-[14px]"
                      key={`key-dropdown-${board.id}`}
                    >
                      {board.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  className="size-6 rounded-full bg-transparent hover:bg-transparent "
                >
                  <MoreHorizontal className="text-default-900 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[196px]" align="start">
                <DropdownMenuItem onSelect={() => setOpen(true)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>Change List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Checkbox radius="xl" size="sm" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="text-default-700 my-1 text-sm font-semibold capitalize">
              {title}
            </div>
          </div>
          <div className="text-default-500 text-[13px]">{desc}</div>
          {image && (
            <div className="mt-3 h-[190px] w-full rounded">
              <Image
                alt=""
                src={image}
                className="size-full rounded object-cover"
              />
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1">
            <Badge
              color={prioritiesColorMap[task.priority]}
              className="rounded px-1 py-0 text-[10px] capitalize leading-4"
            >
              {priority}
            </Badge>
            {tags?.map((tag, i) => (
              <Badge
                key={`badge-key-ssk-${i}`}
                color={tagsColorMap[tag]}
                className="rounded px-1 py-0 text-[10px] capitalize leading-4"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div onClick={(e) => e.stopPropagation()}>
              <AssignMembers />
            </div>
            {assign?.length > 0 && (
              <AvatarGroup total={assign?.length} max={3} countClass="w-5 h-5">
                {assign?.map((member, i) => (
                  <TooltipProvider key={`assign-member-task-${i}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="ring-background ring-offset-background size-5 ring-1 ring-offset-2">
                          <AvatarImage src={member.image.src} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="px-1 py-[2px]">
                        <p className="text-xs font-medium">{member.name}</p>
                        <TooltipArrow className=" fill-primary" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AvatarGroup>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-2 p-0">
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
            <div className="text-default-600 flex items-center gap-1 text-xs">
              <List className="text-default-500 size-3.5" />
              {category}
            </div>
            <div
              className="text-default-600 flex items-center gap-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon="arcticons:documents" className="size-4" />
              0/7
              <ChevronDown className="text-default-600 size-3.5" />
            </div>
            <div className="text-default-600 flex items-center gap-1 text-xs">
              <Icon
                icon="heroicons:chat-bubble-oval-left-ellipsis"
                className="text-default-500 size-3.5"
              />
              {messageCount}
            </div>
            <div className="text-default-600 flex items-center gap-1 text-xs">
              <Link className="text-default-500 size-2.5" />
              {link}
            </div>
            <div
              className="text-default-600 flex items-center gap-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="text-default-500 size-3.5" />
              {date} / {time}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Task;
