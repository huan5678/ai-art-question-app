'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';

import QuestBoard from './(QuestBoard)';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useQuestStore from '@/stores/questStore';

type AddCategoryProps = {
  createCategory: (name: string) => void;
};

const categoryInputSchema = z.object({
  name: z.string().min(1).max(50),
});

const AddCategory = ({ createCategory }: AddCategoryProps) => {
  const [adding, setAdding] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(categoryInputSchema),
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: { name: string }) => {
    createCategory(data.name);
    reset();
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{
            staggerChildren: 0.1,
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="flex items-end gap-2 space-y-4 origin-right"
          layout
          onSubmit={handleSubmit(onSubmit)}
        >
          <motion.div className="flex flex-col gap-2" layout>
            <Label htmlFor="name">題庫名稱</Label>
            <Input type="text" id="name" {...form.register('name')} />
          </motion.div>
          <motion.div layout className="flex gap-2">
            <Button type="submit" variant={'default'} disabled={isSubmitting}>
              新增
            </Button>
            <Button
              type="button"
              onClick={() => setAdding(false)}
              variant={'outline'}
            >
              取消
            </Button>
          </motion.div>
        </motion.form>
      ) : (
        <motion.div layout>
          <Button
            type="button"
            onClick={() => setAdding(true)}
            variant={'ghost'}
            className="flex items-center gap-2"
          >
            新增題庫
            <Icons.plus />
          </Button>
        </motion.div>
      )}
    </>
  );
};

const Page = () => {
  const [createCategory] = useQuestStore((state) => [state.createCategory]);

  return (
    <motion.section
      layout
      className="max-h-screen p-8 overflow-y-auto rounded-lg bg-background"
    >
      <div className="w-full pb-2 border-b">
        <div className="relative flex items-center justify-end">
          <h1 className="absolute text-lg text-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 md:text-2xl">
            題目管理看板
          </h1>
          <AddCategory createCategory={createCategory} />
        </div>
      </div>
      <QuestBoard />
    </motion.section>
  );
};

export default Page;
