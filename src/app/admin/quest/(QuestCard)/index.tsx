'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';

import EditMenu from '../../(EditMenu)';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';
import type {
  IQuestCreateProps,
  Quest,
  TEditMenuOnEditProps,
} from '@/types/quest';

type QuestCardProps = Quest & {
  handleDragStart: (
    e: DragEvent,
    data: {
      title: string;
      id: string;
      category: string | null;
      description: string | null;
    }
  ) => void;
  description?: string | null;
  statute?: boolean;
};

const QuestCard = ({
  title,
  id,
  category,
  handleDragStart,
  description,
  statute,
}: QuestCardProps) => {
  const [quests, updateQuest, deleteQuest] = useQuestStore((state) => [
    state.quests,
    state.updateQuest,
    state.deleteQuest,
  ]);

  const handleUpdateQuest = async (data: TEditMenuOnEditProps) => {
    await updateQuest(data as Quest);
  };
  return (
    <>
      <motion.div
        layout
        layoutId={id}
        draggable={!statute}
        onDragStart={(e: DragEvent) =>
          handleDragStart(e, { title, id, category, description })
        }
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        className={cn(!statute && 'cursor-grab active:cursor-grabbing')}
      >
        <Card
          className={cn(
            'shadow-[0px_6px_0px_rgb(200,_200,_200)] transition-all dark:shadow-[0px_6px_0px_rgb(60,_60,_60)] dark:hover:bg-[var(--n1)] ',
            !statute &&
              'hover:translate-y-1.5 hover:bg-[var(--n8)] hover:shadow-[0px_0px_0px_rgb(200,_200,_200)] dark:hover:shadow-[0px_0px_0px_rgb(60,_60,_60)]'
          )}
        >
          <CardHeader className="py-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{title}</CardTitle>
              <div className="-me-4">
                <EditMenu
                  title={title}
                  onDelete={deleteQuest}
                  onEdit={handleUpdateQuest}
                  content={quests.find((q) => q.id === id) as Quest}
                />
              </div>
            </div>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        </Card>
      </motion.div>
    </>
  );
};

type AddQuestCardProps = {
  category: string | null;
  createQuest: (quest: IQuestCreateProps[]) => Promise<void>;
};

const questInputSchema = z.object({
  title: z.string().min(1, { message: '請輸入題目名稱' }),
  description: z.string().optional(),
});

const AddQuestCard = ({ category, createQuest }: AddQuestCardProps) => {
  const [adding, setAdding] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category,
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
    console.log(data);
    createQuest([{ ...data, category: category ?? '' }]);
    reset();
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <Form {...form}>
          <motion.form
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            layout
            className="space-y-2 overflow-hidden p-2"
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
                variant={'outline'}
              >
                取消
              </Button>
              <Button type="submit" variant={'default'} disabled={isSubmitting}>
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
            variant={'outline'}
            onClick={() => setAdding(true)}
            className="flex w-full select-none items-center gap-1.5"
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
