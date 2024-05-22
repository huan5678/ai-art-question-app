import React, { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { z } from 'zod';

import { addBoardAction, editBoardAction } from '@/action/project-action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
const schema = z.object({
  name: z.string().min(2, { message: 'Your email is invalid.' }),
  status: z.string().optional(),
});
const CreateBoard = ({ open, onClose, board, boardId }) => {
  const [isPending, startTransition] = useTransition();
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

  const ResetForm = async () => {
    reset();
  };
  const onSubmit = (data) => {
    const updatedData = {
      ...board,
      name: data.name,
      status: data.status,
    };
    var result;
    if (board) {
      startTransition(async () => {
        result = await editBoardAction(boardId, updatedData);
        toast.success('Successfully update');
      });
    } else {
      startTransition(async () => {
        result = await addBoardAction(data);
        toast.success('Successfully added');
      });
    }

    console.log(data, 'ami board data');
    onClose();
    reset();
  };
  React.useEffect(() => {
    setValue('name', board?.name || '');
    setValue('status', board?.status || 'defaultStatus');
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent hiddenCloseIcon>
        <DialogHeader className="flex-row items-center justify-between py-0 ">
          <DialogTitle className="text-default-900">Create Board</DialogTitle>
          <DialogClose asChild>
            <div
              type="button"
              size="icon"
              className="size-7 cursor-pointer bg-transparent hover:bg-transparent"
            >
              <X className="text-default-900 size-5" />
            </div>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="-mt-2 py-0 pl-1">
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-5">
            <div>
              <Label htmlFor="boradName" className="text-default-600 mb-1.5">
                Board Name
              </Label>
              <Input
                type="text"
                {...register('name')}
                id="boardName"
                className={cn('', {
                  'border-destructive focus:border-destructive': errors.name,
                })}
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-default-600 mb-1.5">
                Assign Color
              </Label>
              <Input
                type="color"
                name="status"
                className="rounded-md border-none p-0"
                defaultValue="#6338f0"
              />
            </div>
            <div className="flex justify-center gap-4">
              <DialogClose asChild>
                <Button
                  color="destructive"
                  variant="soft"
                  className="min-w-[136px]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="min-w-[136px]">Create Board</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoard;
