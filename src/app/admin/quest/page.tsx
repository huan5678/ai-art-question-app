'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';

import Board from './(Board)';

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
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="flex origin-right items-end gap-2 space-y-4"
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
        </AnimatePresence>
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
  const [
    createCategory,
    questsStatus,
    categoriesStatus,
    getQuests,
    getCategories,
  ] = useQuestStore((state) => [
    state.createCategory,
    state.questsStatus,
    state.categoriesStatus,
    state.getQuests,
    state.getCategories,
  ]);

  useEffect(() => {
    getQuests();
    getCategories();
  }, [getQuests, getCategories]);

  return (
    <section className="bg-background max-h-screen overflow-hidden rounded-lg p-8">
      <div className="w-full border-b pb-2">
        <div className="relative flex items-center justify-end">
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg md:text-2xl">
            題目管理看板
          </h1>
          <AddCategory createCategory={createCategory} />
        </div>
      </div>
      {categoriesStatus === 'pending' || questsStatus === 'pending' ? (
        <motion.div layout className="grid place-content-center p-12">
          <Icons.load className="size-24 animate-spin" />
        </motion.div>
      ) : categoriesStatus === 'success' && questsStatus === 'success' ? (
        <Board />
      ) : null}
    </section>
  );
};

export default Page;
