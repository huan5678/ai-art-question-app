'use client';

import type { FC } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@prisma/client';
import { motion } from 'framer-motion';
import { PlusCircle, X } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestInputProps {
  categories: Category[];
  onCreateQuest: (data: QuestInputState[]) => void;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
}

interface QuestInputState {
  title: string;
  description: string;
  categoryId: string;
}

const questInputSchema = z.object({
  quests: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      categoryId: z.string().optional(),
    })
  ),
});

const QuestInput: FC<QuestInputProps> = ({
  categories,
  onCreateQuest,
  isCreatePending,
  isUpdatePending,
  isDeletePending,
}) => {
  const form = useForm({
    defaultValues: {
      quests: [{ title: '', description: '', categoryId: '' }],
    },
    resolver: zodResolver(questInputSchema),
  });
  const { control, handleSubmit, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quests',
  });

  const onSubmit = (data: { quests: QuestInputState[] }) => {
    onCreateQuest(data.quests);
    reset();
  };

  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.ul
          className="space-y-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {fields.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className="flex flex-wrap gap-4 md:flex-nowrap md:items-end"
            >
              <FormField
                control={control}
                name={`quests.${index}.title`}
                render={({ field }) => (
                  <FormItem className="w-full md:w-auto md:flex-1">
                    <Label
                      htmlFor={`title-${index}`}
                      className="whitespace-nowrap text-center text-lg"
                    >
                      題目名稱
                    </Label>
                    <FormControl>
                      <Input
                        id={`title-${index}`}
                        placeholder="請輸入題目名稱"
                        {...field}
                        className="disabled:pointer-events-none disabled:opacity-20"
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`quests.${index}.description`}
                render={({ field }) => (
                  <FormItem className="w-full md:w-auto md:flex-1">
                    <Label
                      htmlFor={`description-${index}`}
                      className="whitespace-nowrap text-center text-lg"
                    >
                      題目描述
                    </Label>
                    <FormControl>
                      <Input
                        id={`description-${index}`}
                        placeholder="請輸入題目描述"
                        {...field}
                        className="disabled:pointer-events-none disabled:opacity-20"
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`quests.${index}.categoryId`}
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor={`category-${index}`}
                      className="whitespace-nowrap text-center text-lg"
                    >
                      題組
                    </Label>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isPending}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇題組">
                            {field.value
                              ? categories.find((c) => c.id === field.value)
                                  ?.name
                              : '選擇題組'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="''">選擇題組</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              {fields.length - 1 !== index && (
                <Button
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={isPending}
                  className="disabled:pointer-events-none disabled:opacity-20"
                >
                  <X className="me-2 size-6" />
                  刪除項目
                </Button>
              )}
              {fields.length - 1 === index && (
                <Button
                  type="button"
                  variant={'secondary'}
                  onClick={() =>
                    append({ title: '', description: '', categoryId: '' })
                  }
                  disabled={isPending}
                  className="disabled:pointer-events-none disabled:opacity-20"
                >
                  <PlusCircle className="me-2 size-6" />
                  增加項目
                </Button>
              )}
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
      </form>
    </Form>
  );
};

export default QuestInput;
