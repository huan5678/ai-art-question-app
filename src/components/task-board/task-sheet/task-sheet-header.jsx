'use client';

import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CustomPopover } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const TaskSheetHeader = ({ toggleCollapse }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // timer start
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setElapsedTime(0);
      setIsRunning(false);
    } else if (!isRunning) {
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      setIsRunning(true);
    }
  };
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes % 60).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  // timer end

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="text-default-600 bg-default-100 rounded px-3 py-[2px] text-sm font-medium">
          DT 01
        </div>
        <div className="w-fit px-1">
          <Select>
            <SelectTrigger className="h-6">
              <SelectValue placeholder="todo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2 pr-5">
        {/* timer */}
        <div className="flex items-center gap-2">
          <p className="text-default-600 text-sm font-medium">
            {formatTime(elapsedTime)}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleTimer}
                  type="button"
                  size="icon"
                  className={cn(
                    'hover:bg-default-200 size-8 rounded-full bg-transparent',
                    {
                      'bg-default-200': isRunning,
                    }
                  )}
                >
                  {isRunning ? (
                    <Icon
                      icon="heroicons:play-pause"
                      className="text-default-500 size-[14px]"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:play"
                      className="text-default-500 size-[14px]"
                    />
                  )}
                </Button>
              </TooltipTrigger>
              {!isRunning && (
                <TooltipContent>
                  <p>Start Trucking Time</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          type="button"
          size="icon"
          className="hover:bg-default-50 rounded-full bg-transparent"
        >
          <Icon icon="heroicons:bell" className="text-default-500 size-5" />
        </Button>
        {/* notifications */}

        <div className="cursor-pointer">
          <Icon icon="heroicons:eye" className="text-default-500 size-5" />
        </div>
        <div className="cursor-pointer">
          <Icon
            icon="heroicons:ellipsis-horizontal-16-solid"
            className="text-default-500 size-5"
          />
        </div>
        <div
          onClick={toggleCollapse}
          className="hidden cursor-pointer xl:block"
        >
          <Icon
            icon="heroicons:arrows-right-left-solid"
            className="text-default-500 size-5"
          />
        </div>
      </div>
    </>
  );
};

export default TaskSheetHeader;
