'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { z } from 'zod';

import DropIndicator from '../(DropIndicator)';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { QuestType } from '@/types/quest';

type QuestCardProps = QuestType & {
  handleDragStart: (
    e: DragEvent,
    data: { title: string; id: string; categoryId: string }
  ) => void;
};

const QuestCard = ({
  title,
  id,
  categoryId,
  handleDragStart,
}: QuestCardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} categoryId={categoryId} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: DragEvent) =>
          handleDragStart(e, { title, id, categoryId })
        }
        className="p-3 border rounded cursor-grab border-neutral-700 bg-neutral-800 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

type AddQuestCardProps = {
  categoryId: string;
  createQuest: (
    quests: { title: string; description: string; categoryId: string },
    userId: string
  ) => void;
};

const questInputSchema = z.object({
  quest: z.object({
    title: z.string().min(1, '請輸入題目名稱'),
    description: z.string().optional(),
  }),
});

const AddQuestCard = ({ categoryId, createQuest }: AddQuestCardProps) => {
  const [adding, setAdding] = useState(false);
  const { data: session } = useSession();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      categoryId,
    },
    resolver: zodResolver(questInputSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: { title: string; description: string }) => {
    createQuest({ ...data, categoryId }, session?.user?.id as string);
    reset();
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-2 overflow-hidden"
            layout
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name={'title'}
              render={({ field }) => (
                <FormItem className="w-full md:w-auto md:flex-1">
                  <FormLabel htmlFor="title">題目名稱</FormLabel>
                  <FormControl>
                    <Input
                      id={'title'}
                      placeholder="請輸入題目名稱"
                      {...field}
                      className="disabled:pointer-events-none disabled:opacity-20"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={'description'}
              render={({ field }) => (
                <FormItem className="w-full md:w-auto md:flex-1">
                  <FormLabel htmlFor="description">題目描述</FormLabel>
                  <FormControl>
                    <Input
                      id={'description'}
                      placeholder="請輸入題目描述"
                      {...field}
                      className="disabled:pointer-events-none disabled:opacity-20"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-1.5 flex items-center justify-end gap-1.5 text-xs">
              <Button
                type="button"
                onClick={() => setAdding(false)}
                variant={'ghost'}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant={'secondary'}
                disabled={isSubmitting}
              >
                <span>儲存題目</span>
                <Icons.plus />
              </Button>
            </div>
          </motion.form>
        </Form>
      ) : (
        <motion.div layout>
          <Button
            type="button"
            variant={'ghost'}
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-1.5"
          >
            <span>新增題目</span>
            <Icons.plus />
          </Button>
        </motion.div>
      )}
    </>
  );
};

export { QuestCard, AddQuestCard };
