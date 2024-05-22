'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { z } from 'zod';

import { addSubTaskAction } from '@/action/project-action';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, formatDate } from '@/lib/utils';
const schema = z.object({
  title: z.string().min(2, { message: 'title lagbe re vai .' }),
});
const AddSubTask = ({ taskId }) => {
  const [isPending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data) => {
    data.assignDate = formatDate(new Date());
    data.completed = false;
    data.taskId = taskId;
    var result;

    startTransition(async () => {
      result = await addSubTaskAction(data);
      toast.success('Successfully added');
    });

    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative pr-1.5">
      <Label
        htmlFor="add-subtask"
        className="absolute left-6 top-1/2 z-10 m-0 -translate-y-1/2 cursor-pointer p-0"
      >
        <Plus className="text-default-500 size-5 " />
      </Label>
      <Input
        id="add-subtask"
        {...register('title')}
        className={cn(
          'border-default-200 text-default-600 focus:border-default-300 h-[52px] rounded-none border-b pl-12 text-sm font-medium focus:inset-4 focus:shadow-sm focus:drop-shadow-sm',
          {
            'border-destructive focus:border-destructive': errors.title,
          }
        )}
        placeholder="Add a new subtask..."
      />
    </form>
  );
};

export default AddSubTask;
