'use client';

import { type FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';

import { Icons } from '../icons';

import { DataList } from '@/components/datalist';
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
import type { IQuestCreateProps, IQuestInputProps } from '@/types/quest';

const questInputSchema = z.object({
  quests: z.array(
    z.object({
      title: z.string().min(1, '請輸入題目名稱'),
      description: z.string().optional(),
      category: z.string().optional(),
    })
  ),
});

const QuestInput: FC<IQuestInputProps> = ({
  categories,
  onCreateQuest,
  status,
}) => {
  const [isPending, setIsPending] = useState(true);
  const form = useForm({
    defaultValues: {
      quests: [{ title: '', description: '', category: '' }],
    },
    resolver: zodResolver(questInputSchema),
  });
  const { control, handleSubmit, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quests',
  });

  const onSubmit = (data: { quests: IQuestCreateProps[] }) => {
    setIsPending(true);
    onCreateQuest(data.quests);
    reset();
    setIsPending(false);
  };

  useEffect(() => {
    status && setIsPending(false);
  }, [status]);

  return (
    !isPending && (
      <Form {...form}>
        <motion.form
          layout
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <motion.ul layout className="space-y-4">
            {fields.map((item, index) => (
              <motion.li
                layout
                key={item.id}
                className="grid gap-4 md:grid-cols-4"
              >
                <FormField
                  control={control}
                  name={`quests.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="w-full md:w-auto md:flex-1">
                      <FormLabel htmlFor={`title-${index}`}>題目名稱</FormLabel>
                      <FormControl>
                        <Input
                          id={`title-${index}`}
                          placeholder="請輸入題目名稱"
                          {...field}
                          className="disabled:pointer-events-none disabled:opacity-20"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`quests.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="w-full md:w-auto md:flex-1">
                      <FormLabel htmlFor={`description-${index}`}>
                        題目描述
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`description-${index}`}
                          placeholder="請輸入題目描述"
                          {...field}
                          className="disabled:pointer-events-none disabled:opacity-20"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`quests.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={`category-${index}`}>題庫</FormLabel>
                      <FormControl>
                        <DataList
                          id={`category-${index}`}
                          data={categories}
                          onSelect={field.onChange}
                          disabled={isPending}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end justify-end gap-2">
                  {fields.length !== 1 && (
                    <Button
                      variant="destructive"
                      onClick={() => remove(index)}
                      disabled={isPending}
                      className="disabled:pointer-events-none disabled:opacity-20"
                    >
                      <Icons.x className="me-2 size-4" />
                      刪除項目
                    </Button>
                  )}
                  {fields.length - 1 === index && (
                    <Button
                      type="button"
                      variant={'secondary'}
                      onClick={() =>
                        append({ title: '', description: '', category: '' })
                      }
                      disabled={isPending}
                      className="disabled:pointer-events-none disabled:opacity-20"
                    >
                      <Icons.plusCircle className="me-2 size-4" />
                      增加項目
                    </Button>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full disabled:opacity-20 md:w-auto"
          >
            新增題目到資料庫
          </Button>
        </motion.form>
      </Form>
    )
  );
};

export default QuestInput;
