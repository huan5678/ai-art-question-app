'use client';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { X } from 'lucide-react';

import Attachments from './attachments';
import Comments from './comments';
import SheetActions from './sheet-actions';
import SheetTitleDesc from './sheet-title-desc';
import SubTasks from './sub-tasks';
import TaskSheetHeader from './task-sheet-header';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const TaskSheet = ({ open, onClose, taskId, task, subTasks, comments }) => {
  const [collapseSheet, setCollapseSheet] = useState(false);
  const toggleCollapse = () => setCollapseSheet(!collapseSheet);
  return (
    <Sheet open={open}>
      <SheetContent
        side="right"
        onClose={onClose}
        closeIcon={<X className="relative top-4 size-4" />}
        className={cn('w-[85%] p-0 md:max-w-[1200px]', {
          'md:max-w-[600px]': collapseSheet,
        })}
      >
        <SheetHeader className="border-default-200 justify-between gap-3 space-y-0 border-b px-2  py-5 sm:flex-row xl:px-6">
          <TaskSheetHeader
            collapseSheet={collapseSheet}
            toggleCollapse={toggleCollapse}
          />
        </SheetHeader>
        <div
          className={cn('grid grid-cols-1 xl:grid-cols-2', {
            'xl:grid-cols-1': collapseSheet,
          })}
        >
          {/* left side */}
          <div className="border-default-200 min-h-screen border-r">
            <div className="h-[calc(100vh-70px)]">
              <ScrollArea className="h-full">
                {/* sheet title & desc */}
                <SheetTitleDesc task={task} taskId={taskId} />
                {/* sheet actions */}
                <SheetActions task={task} taskId={taskId} />
                {/* tabs */}
                <Tabs defaultValue="subtasks">
                  <TabsList className="bg-default-100 flex h-12 w-full justify-between rounded-none p-0 px-2 xl:px-12">
                    <TabsTrigger
                      value="subtasks"
                      className=" text-default-600 data-[state=active]:border-primary h-full rounded-none border-b border-transparent bg-transparent py-0 text-sm font-medium capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <Icon
                        icon="heroicons:document-text"
                        className="mr-1.5 size-3.5"
                      />
                      subtasks
                    </TabsTrigger>

                    <TabsTrigger
                      value="attachments"
                      className=" text-default-600 data-[state=active]:border-primary h-full rounded-none border-b border-transparent bg-transparent py-0 text-sm font-medium capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <Icon
                        icon="heroicons:paper-clip"
                        className="mr-1.5 size-3.5"
                      />
                      attachments
                    </TabsTrigger>

                    <TabsTrigger
                      value="comments"
                      className={cn(
                        'text-default-600 data-[state=active]:border-primary h-full rounded-none border-b border-transparent bg-transparent py-0 text-sm font-medium capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                        {
                          'flex xl:hidden': !collapseSheet,
                        }
                      )}
                    >
                      <Icon
                        icon="heroicons:chat-bubble-bottom-center"
                        className="mr-1.5 size-3.5"
                      />
                      comments
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="subtasks">
                    <SubTasks subTasks={subTasks} taskId={taskId} />
                  </TabsContent>
                  <TabsContent value="attachments">
                    <Attachments />
                  </TabsContent>
                  <TabsContent value="comments">
                    <Comments
                      comments={comments}
                      taskId={taskId}
                      className="h-[calc(100vh-400px)]"
                    />
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </div>
          </div>
          {/* right side */}

          <div
            className={cn('hidden xl:block', {
              'xl:hidden': collapseSheet,
            })}
          >
            <Comments
              className="h-[calc(100vh-210px)]"
              comments={comments}
              taskId={taskId}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
