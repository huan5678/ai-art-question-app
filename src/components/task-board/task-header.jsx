'use client';

import { Icon } from '@iconify/react';
import { Plus, Search, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TaskHeader = ({ taskViewHandler, openCreateBoard, taskView }) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-1 items-center  gap-4">
        {/* search task */}
        <div className="relative min-w-[240px]">
          <span className="absolute top-1/2 -translate-y-1/2 ltr:left-2 rtl:right-2">
            <Search className="text-default-500 size-4" />
          </span>
          <Input
            type="text"
            placeholder="search files"
            className="ltr:pl-7 rtl:pr-7"
            size="lg"
          />
        </div>
        {/* filter task */}
        <div className="relative">
          <Icon
            icon="heroicons:swatch"
            className="text-default-600 absolute left-2.5 top-1/2 size-4 -translate-y-1/2"
          />
          <Select>
            <SelectTrigger className="min-w-[120px] whitespace-nowrap py-0 pl-9">
              <SelectValue placeholder="All Task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task_1">Task 1</SelectItem>
              <SelectItem value="task_2">Task 2</SelectItem>
              <SelectItem value="task_3">Task 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Group By */}
        <div className="relative">
          <Icon
            icon="heroicons:swatch"
            className="text-default-600 absolute left-2.5 top-1/2 size-4 -translate-y-1/2"
          />
          <Select>
            <SelectTrigger className="min-w-[160px] whitespace-nowrap pl-9">
              <SelectValue placeholder="Group By: status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task_1">Inprogress</SelectItem>
              <SelectItem value="task_2">Complete</SelectItem>
              <SelectItem value="task_3">Task 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-none items-center gap-4">
        <div className="relative">
          <span className="text-default-600 border-default-200 absolute right-2.5 top-1/2 flex h-full w-8 -translate-y-1/2 items-center justify-center border-l">
            <Settings className="size-4 " />
          </span>
          <Select onValueChange={taskViewHandler}>
            <SelectTrigger className="min-w-[160px] pr-11">
              <SelectValue placeholder="Kanban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kanban">Kanban</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={openCreateBoard}>
          <Plus className="size-4 ltr:mr-1 rtl:ml-1" /> Create Board
        </Button>
      </div>
    </div>
  );
};

export default TaskHeader;
