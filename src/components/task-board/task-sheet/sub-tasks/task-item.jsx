'use client';
import React from 'react';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { ArrowRightLeft, Check, Tag, Trash2, X } from 'lucide-react';

import AssignMembers from '../../common/assign-members';

import {
  deleteSubTaskAction,
  updateSubTaskAction,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const TaskItem = ({ subtask, handlerSubSheet }) => {
  const { completed, assignDate, id } = subtask;
  const [isDone, setIsDone] = React.useState(completed);
  // update isComplete
  const [open, setOpen] = useState(false);

  const handleIsComplete = async (value) => {
    try {
      const newData = {
        ...subtask,
        completed: value,
      };

      await updateSubTaskAction(id, newData);
    } catch (error) {
      console.log(error);
    }
    setIsDone(!isDone);
  };

  const onAction = async (dltId) => {
    await deleteSubTaskAction(dltId);
  };
  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onAction(id)}
      />
      <div
        className={cn(
          'border-default-200 flex cursor-pointer gap-2 border-b border-dashed px-6 py-3',
          {
            'bg-default-50': completed,
          }
        )}
        onClick={handlerSubSheet}
      >
        <div className="mt-1 flex-none">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              size="sm"
              checked={isDone}
              onCheckedChange={handleIsComplete}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex">
            <div
              className={cn('text-default-900 flex-1 text-base font-medium', {
                'line-through': completed,
              })}
            >
              {subtask?.title}
            </div>
            <div className="flex flex-none items-center gap-2">
              {/* assigned members */}
              {subtask?.assign?.length > 0 && (
                <div>
                  <AvatarGroup
                    max={3}
                    total={subtask.assign.length}
                    countClass="w-7 h-7"
                  >
                    {subtask.assign?.map((user, i) => (
                      <Avatar
                        className=" ring-background ring-offset-background size-7  ring-1 ring-offset-2"
                        key={`avatar-key-${i}`}
                      >
                        <AvatarImage src={user.image} />
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </div>
              )}
              {/* add new members start*/}
              <div onClick={(e) => e.stopPropagation()}>
                <AssignMembers />
              </div>

              {/* add new members end*/}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-default-100 text-primary hover:bg-default-100 relative size-6 rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon
                      icon="heroicons:ellipsis-horizontal"
                      className="text-default-900 size-4"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end">
                  {!completed && (
                    <>
                      <DropdownMenuItem className="gap-2">
                        <Icon
                          icon="heroicons:calendar"
                          className="text-default-500 size-4"
                        />
                        Add a due date
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2">
                        <Tag className="text-default-500 size-4" />
                        Manage Tags
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2">
                        <Check className="text-default-500 size-4" />
                        Convert to a task
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <ArrowRightLeft className="text-default-500 size-4" />
                        Move into another task
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    className="hover:bg-destructive hover:text-destructive-foreground group gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                  >
                    <Trash2 className="text-default-500 group-hover:text-destructive-foreground size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {completed ? (
              <Badge
                color="success"
                variant="soft"
                className="rounded px-1 py-0 text-[10px] capitalize leading-4"
              >
                Completed
              </Badge>
            ) : (
              <Badge
                color="warning"
                variant="soft"
                className="rounded px-1 py-0 text-[10px] capitalize leading-4"
              >
                {subtask.priority}
              </Badge>
            )}

            <div className="text-default-500 flex items-center gap-1 text-xs">
              <Icon
                icon="heroicons:calendar"
                className="text-default-500 size-3.5"
              />
              <span>{assignDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
