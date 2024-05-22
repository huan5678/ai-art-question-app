'use client';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { z } from 'zod';

import { updateTaskAction } from '@/action/project-action';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const schema = z.object({
  title: z.string().min(1, {
    message: 'What is your task title? ???',
  }),
  desc: z.string().optional(),
});
const SheetTitleDesc = ({ task, taskId }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 3000);
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const onSubmit = async (data) => {
    const newData = {
      ...task,
      title: data.title,
      desc: data.desc,
    };
    try {
      await updateTaskAction(taskId, newData);
      console.log('update data');
      // Additional logic after updating assign
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('desc', task.desc || '');
    }
  }, [task, setValue]);
  return (
    <form
      className="border-default-200 border-b px-6 py-5 pb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-2 flex items-center gap-1">
        <Checkbox className="size-4" color="secondary" />

        <input
          type="text"
          {...register('title')}
          className="text-default-900 focus:border-default-200 focus:bg-default-50 bg-card h-7 w-full rounded-sm border border-transparent px-1 text-sm font-medium focus:border focus:outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {errors.title && (
        <div className=" text-destructive">{errors.title.message}</div>
      )}

      <div className="relative flex gap-1">
        <div className="mt-1">
          <Icon
            icon="heroicons:information-circle"
            className="text-default-900 size-5"
          />
        </div>
        <textarea
          className="focus:border-default-200 text-default-700 bg-card focus:bg-default-50 peer h-16 w-full border border-none border-transparent p-1 text-sm focus:outline-none"
          placeholder="Add Task Descriptions"
          rows="1"
          {...register('desc')}
          onInput={handleFocus}
          onBlur={handleBlur}
          style={{ resize: 'none', overflowY: 'hidden' }}
        />
      </div>
      <div className="flex justify-end">
        {isFocused && (
          <Button className=" h-6 py-0 text-xs" type="submit">
            Save
          </Button>
        )}
      </div>
    </form>
  );
};

export default SheetTitleDesc;
