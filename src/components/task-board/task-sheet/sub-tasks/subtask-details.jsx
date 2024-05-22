'use client';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { Plus } from 'lucide-react';

import AssignMembers from '../../common/assign-members';
import Priority from '../../common/priority';
import TaskDate from '../../common/task-date';
import Comments from '../comments';
import SubTaskHeader from './subtask-header';

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
const SubtaskDetailsSheet = ({ open, onClose }) => {
  return (
    <Sheet open={open}>
      <SheetContent
        side="right"
        onClose={onClose}
        className="flex w-full flex-col border-none p-0 md:min-w-[600px]"
      >
        <SheetHeader className="flex-none">
          <SubTaskHeader />
        </SheetHeader>
        {/* actions */}
        <div className="grid flex-none grid-cols-3 gap-2 p-6">
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
              <AvatarGroup
                max={3}
                total={members.length - 3}
                countClass="w-6 h-6"
              >
                {members?.map((item, index) => (
                  <TooltipProvider key={`task-assigned-members-${index}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="ring-background ring-offset-background size-6 ring-1 ring-offset-2">
                          <AvatarImage src={item.image} />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent
                        color="primary"
                        side="bottom"
                        className="px-2 py-[2px]"
                      >
                        <p className="text-xs font-medium">{item.name}</p>
                        <TooltipArrow className=" fill-primary" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

                <Avatar className="ring-background ring-offset-background size-6 ring-1 ring-offset-2">
                  <AvatarFallback className="font-normal">+10</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              {/* add new member */}
              <AssignMembers icon={<Plus className="text-primary size-4" />} />
            </div>
          </div>
          {/* assigned members end */}
          {/* priority */}
          <div>
            <div className="mb-3 flex items-center gap-1">
              <div className="bg-default-100 grid size-6 place-content-center rounded-full">
                <Icon
                  icon="heroicons:scale"
                  className="text-primary size-3.5"
                />
              </div>
              <span className="text-default-900 text-sm font-medium">
                Priority
              </span>
            </div>
            <Priority />
          </div>
          {/* priority end */}
          {/* start date */}

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

          {/* end date */}
        </div>
        <div className="flex-1">
          <Comments className="h-[calc(100vh-450px)]" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SubtaskDetailsSheet;
