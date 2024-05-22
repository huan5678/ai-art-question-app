'use client';
import React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
// dnd
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import AddTask from './add-task';
import Board from './board';
import CreateBoard from './create-borad';
import Task from './task';
import TaskHeader from './task-header';
import TaskList from './task-list';
import TaskTable from './task-list/task-table';
import TaskSheet from './task-sheet';

import { editBoardAction, swapBoardAction } from '@/action/project-action';
import Blank from '@/components/blank';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
const TaskBoard = ({ boards, tasks, subTasks, comments }) => {
  const [taskView, setTaskView] = useState('kanban');

  const [open, setOpen] = useState(false);
  // for task create modal
  const [open2, setOpen2] = useState(false);
  // update task
  const [open3, setOpen3] = useState(false);
  // for board
  const [selectedBoardId, setSelectedBoardId] = React.useState(null);
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  // for task
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [selectedBoardForTask, setSelectedBoardForTask] = React.useState(null);

  // handler task view
  const taskViewHandler = (value) => {
    setTaskView(value);
  };
  // handle create board
  const openCreateBoard = () => {
    setSelectedBoardId(null);
    setSelectedBoard(null);
    setOpen(true);
  };
  // handle edit board
  const openEdit = (board) => {
    setSelectedBoardId(board.id);
    setSelectedBoard(board);
    setOpen(true);
  };

  // handle close create board
  const closeCreateBoard = () => {
    setSelectedBoardId(null);
    setSelectedBoard(null);
    setOpen(false);
    wait().then(() => (document.body.style.pointerEvents = 'auto'));
  };

  // handle task board opener
  const handleTaskOpener = (boardId) => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setSelectedBoardForTask(boardId);
    setOpen2(true);
  };

  const closeTaskHandler = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setSelectedBoardForTask(null);
    setOpen2(false);
  };

  // update task handler
  const updateTaskHandler = (task) => {
    setSelectedTaskId(task.id);
    setSelectedTask(task);
    setOpen3(true);
  };
  const closeUpdateTaskHandler = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setOpen3(false);
  };

  const filteredTasks = (tasks, boardId) => {
    // Add your filtering logic here
    return tasks?.filter((task) => task.boardId === boardId);
  };
  // dnd
  const [isPending, startTransition] = React.useTransition();
  const boardsId = React.useMemo(
    () => boards.map((board) => board.id),
    [boards]
  );
  const tasksIds = React.useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [activeBoard, setActiveBoard] = React.useState(null);
  const handleDragStart = (event) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveBoard(event.active.data.current.board);

      return;
    }
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeBoardId = active.id;
    const overBoardId = over.id;
    if (activeBoardId === overBoardId) return;

    const oldIndex = boardsId.indexOf(activeBoardId);

    const newIndex = boardsId.indexOf(overBoardId);

    if (oldIndex !== newIndex) {
      let data = {
        activeBoardId,
        overBoardId,
      };
      var result;
      startTransition(async () => {
        result = await swapBoardAction(data);
        toast.success('Successfully update');
      });
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const onDragOver = (event) => {
    console.log('ami k');
  };
  return (
    <>
      {boards?.length > 0 ? (
        <Card className="overflow-y-auto">
          <CardHeader className="mb-6 border-none pt-6">
            <TaskHeader
              taskView={taskView}
              taskViewHandler={taskViewHandler}
              openCreateBoard={openCreateBoard}
            />
          </CardHeader>
          <CardContent>
            {taskView === 'kanban' && (
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
                onDragOver={onDragOver}
                // onDragOver={handleDragOver}
                // onDragCancel={handleDragCancel}
              >
                <div className="overflow-x-auto">
                  <div className="flex flex-nowrap gap-6">
                    <SortableContext items={boardsId}>
                      {boards?.map((board, i) => (
                        <Board
                          key={`board-id-${board.id}`}
                          board={board}
                          onEdit={openEdit}
                          taskHandler={handleTaskOpener}
                          isTaskOpen={open2}
                          showButton={
                            !open2 || selectedBoardForTask !== board.id
                          }
                          tasks={tasks.filter(
                            (task) => task.boardId === board.id
                          )}
                          onUpdateTask={updateTaskHandler}
                          boards={boards}
                        >
                          <SortableContext items={tasksIds}>
                            {filteredTasks(tasks, board.id)?.map(
                              (filteredTask, j) => (
                                <Task
                                  key={`task-key-${j}`}
                                  task={filteredTask}
                                  onUpdateTask={updateTaskHandler}
                                  boards={boards}
                                />
                              )
                            )}
                          </SortableContext>
                          {open2 && selectedBoardForTask === board.id && (
                            <AddTask
                              onClose={closeTaskHandler}
                              boardId={selectedBoardForTask}
                            />
                          )}
                        </Board>
                      ))}
                    </SortableContext>
                  </div>
                </div>

                <DragOverlay adjustScale={false}>
                  {activeBoard && (
                    <Board board={activeBoard}>
                      {filteredTasks(tasks, activeBoard.id)?.[0] && (
                        <Task
                          task={filteredTasks(tasks, activeBoard.id)?.[0]}
                          boards={boards}
                        />
                      )}
                    </Board>
                  )}
                </DragOverlay>
              </DndContext>
            )}

            {taskView === 'list' &&
              boards.map((board, i) => (
                <TaskList
                  key={`list-view-key-${i}`}
                  board={board}
                  onEdit={openEdit}
                  length={filteredTasks(tasks, board.id).length}
                >
                  <TaskTable
                    boards={boards}
                    data={filteredTasks(tasks, board.id)}
                    onUpdateTask={updateTaskHandler}
                    boardID2={board.id}
                  />
                </TaskList>
              ))}
          </CardContent>
        </Card>
      ) : (
        <Blank className="mx-auto max-w-[353px] space-y-4">
          <div className=" text-default-900 text-xl font-semibold">
            No Task Here
          </div>
          <div className=" text-default-600 text-sm">
            There is no task create. If you create a new task then click this
            button & create new board.
          </div>
          <Button onClick={openCreateBoard}>
            <Plus className="mr-1 size-4" /> Create Board
          </Button>
        </Blank>
      )}
      {/* update task  modal/sheet */}
      <CreateBoard
        open={open}
        onClose={closeCreateBoard}
        board={selectedBoard}
        boardId={selectedBoardId}
      />
      {/* update task  modal/sheet */}
      <TaskSheet
        open={open3}
        onClose={closeUpdateTaskHandler}
        task={selectedTask}
        taskId={selectedTaskId}
        subTasks={subTasks}
        comments={comments}
      />
    </>
  );
};

export default TaskBoard;
