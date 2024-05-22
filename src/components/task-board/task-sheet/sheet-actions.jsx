'use client';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { Check, Hash, List, Plus } from 'lucide-react';

import AssignList from '../common/assign-list';
import AssignMembers from '../common/assign-members';
import AssignTags from '../common/assign-tags';
import Dependency from '../common/dependency';
import Priority from '../common/priority';
import StoryPoint from '../common/story-point';
import TaskDate from '../common/task-date';

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SheetActions = ({ task, taskId }) => {
  return (
    <div className="border-default-200 border-b px-4 py-5 lg:px-6">
      <div className="grid  grid-cols-2  gap-y-6 md:grid-cols-3 md:gap-2">
        {/* assignd members */}
        <div>
          <div className="mb-3 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <Icon
                icon="heroicons:user-plus"
                className="text-primary size-3.5"
              />
            </div>
            <span className="text-default-900 text-sm font-medium">
              Assigned
            </span>
          </div>
          <div className="flex items-center gap-3">
            {task?.assign?.length > 0 && (
              <AvatarGroup
                countClass="w-5 h-5"
                total={task?.assign?.length}
                max={3}
              >
                {task?.assign?.map((member, i) => (
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
            <AssignMembers icon={<Plus className="text-primary size-3" />} />
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <Icon icon="heroicons:scale" className="text-primary size-3.5" />
            </div>
            <span className="text-default-900 text-sm font-medium">
              Priority
            </span>
          </div>
          <Priority task={task} taskId={taskId} />
        </div>
        {/*  assigned list*/}
        <div>
          <div className="mb-2 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <List className="text-primary size-3.5" />
            </div>
            <span className="text-default-900 text-sm font-medium">List</span>
          </div>
          <AssignList />
        </div>

        {/* task date */}
        <div>
          <div className="mb-3 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <Icon
                icon="heroicons:calendar"
                className="text-primary size-3.5"
              />
            </div>
            <span className="text-default-900 text-sm font-medium">Date</span>
          </div>
          <TaskDate />
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <Check className="text-primary size-3.5" />
            </div>
            <span className="text-default-900 text-sm font-medium">
              Dependency
            </span>
          </div>
          <Dependency />
        </div>
        <div>
          <div className="mb-3 flex items-center gap-1">
            <div className="bg-default-100 grid size-6 place-content-center rounded-full">
              <Hash className="text-primary size-3.5" />
            </div>
            <span className="text-default-900 text-sm font-medium">
              Story Points
            </span>
          </div>
          <StoryPoint />
        </div>
      </div>
      <div className="mt-6">
        <AssignTags task={task} taskId={taskId} />
      </div>
    </div>
  );
};

export default SheetActions;
