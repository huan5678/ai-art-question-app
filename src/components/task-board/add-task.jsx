'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus } from 'lucide-react';
import { z } from 'zod';

import { addTaskAction } from '@/action/project-action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
const options = [
  { value: 'plan-2023', label: 'Plan 2023' },
  { value: 'plan-2024', label: 'Plan 2024' },
  { value: 'plan-2025', label: 'Plan 2025' },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
  }),
};

const schema = z.object({
  title: z.string().min(2, { message: 'title lagbe re vai .' }),
});
const AddTask = ({ onClose, boardId }) => {
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
    data.boardId = boardId;
    var result;

    startTransition(async () => {
      result = await addTaskAction(data);
      toast.success('Successfully added');
    });

    onClose();
    reset();
  };
  return (
    <Card className="w-full ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="mb-0">
          <div>
            <div className="text-default-900 mb-[2px] flex items-center gap-1 text-base font-medium">
              List <ChevronDown className="size-4" />
            </div>
            {/* active list */}
            <div className="text-default-600 text-xs font-medium">
              UX/UI Design
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pb-0">
          <Input
            type="text"
            {...register('title')}
            className={cn('', {
              'border-destructive focus:border-destructive': errors.title,
            })}
          />
        </CardContent>
        <CardFooter className="mt-1 justify-end gap-3 p-3 pt-0">
          <Button
            type="button"
            color="destructive"
            variant="soft"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddTask;
