'use client';

import { useEffect, useState } from 'react';
import type { Category, Quest } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PlusCircle, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import useQuestStore from '@/stores/questStore';

const Page = () => {
  const { toast } = useToast();
  const [questInput, setQuestInput] = useState<string[]>(['']);
  const [categoryInput, setCategoryInput] = useState<string[]>(['']);
  const [quests, categories, setQuests, setCategories] = useQuestStore(
    (state) => [
      state.quests,
      state.categories,
      state.setQuests,
      state.setCategories,
    ]
  );
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'quest' | 'category'
  ) => {
    switch (type) {
      case 'quest':
        setQuestInput((prev) => {
          const copy = [...prev];
          copy[index] = e.target.value;
          return copy;
        });
        break;
      case 'category':
        setCategoryInput((prev) => {
          const copy = [...prev];
          copy[index] = e.target.value;
          return copy;
        });
        break;
      default:
        break;
    }
  };

  const handleInputOnKeyEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: 'quest' | 'category'
  ) => {
    if (e.key === 'Enter') {
      switch (type) {
        case 'quest':
          setQuestInput((prev) => {
            const copy = [...prev];
            copy[index] = e.currentTarget.value;
            return copy;
          });
          break;
        case 'category':
          setCategoryInput((prev) => {
            const copy = [...prev];
            copy[index] = e.currentTarget.value;
            return copy;
          });
          break;
        default:
          break;
      }
    }
  };

  const { mutate: handleCreateQuest, isPending } = useMutation({
    mutationFn: async (input: string[]) => {
      const response = await fetch('/api/quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: input }),
      });
      return response.json();
    },
    onSuccess: (data: Quest[]) => {
      setQuests(data);
      toast({
        title: '新增成功',
        description: '已新增題目到資料庫',
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: '新增失敗',
        description: '請再試一次',
      });
    },
  });

  const { mutate: handleCreateCategory, isPending: isCategoryPending } =
    useMutation({
      mutationFn: async (input: string[]) => {
        const response = await fetch('/api/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: input }),
        });
        return response.json();
      },
      onSuccess: (data: Category[]) => {
        setCategories(data);
        toast({
          title: '新增成功',
          description: '已新增題庫名稱到資料庫',
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: '新增失敗',
          description: '請再試一次',
        });
      },
    });

  const { data: questsData, status: questsStatus } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await fetch('/api/quest');
      console.log(response);
      return response.json();
    },
  });

  const { data: categoriesData, status: categoriesStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      console.log(response);
      return response.json();
    },
  });

  useEffect(() => {
    setQuests(questsData);
    console.log(questsData);
    setCategories(categoriesData);
    console.log(categoriesData);
  }, [questsData, categoriesData, setQuests, setCategories]);

  return (
    <section className="container max-w-2xl space-y-4 pt-12 md:max-w-6xl">
      <h1 className="text-center text-3xl text-white md:text-6xl">
        後台管理系統
      </h1>
      <div className="bg-background rounded-lg p-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="md:text-lg">題目設定</span>
            </AccordionTrigger>
            {questsStatus === 'success' && (
              <AccordionContent className="p-4">
                {quests.length > 0 && (
                  <h2>題目資料集 目前題目數:({quests.length})</h2>
                )}
                <motion.ul
                  className="space-y-4 py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {questInput.map((item, i) => (
                    <motion.li
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                      className="flex flex-wrap gap-4 md:flex-nowrap md:items-center"
                      key={crypto.randomUUID()}
                    >
                      <Label
                        htmlFor={`input${i}`}
                        className="whitespace-nowrap text-center text-lg"
                      >
                        題目名稱
                      </Label>
                      <Input
                        id={`input${i}`}
                        type="text"
                        placeholder="請輸入題目名稱"
                        value={item}
                        onChange={(e) => handleInputChange(e, i, 'quest')}
                        onKeyUp={(e) => handleInputOnKeyEnter(e, i, 'quest')}
                        className="disabled:pointer-events-none disabled:opacity-20"
                        disabled={isPending}
                      />
                      {questInput.length > 0 && i === questInput.length - 1 && (
                        <Button
                          className="flex-auto disabled:pointer-events-none disabled:opacity-20"
                          disabled={isPending}
                          onClick={() => setQuestInput((prev) => [...prev, ''])}
                        >
                          <PlusCircle className="me-2 size-6" />
                          增加項目
                        </Button>
                      )}
                      {questInput.length > 1 && (
                        <Button
                          variant={'destructive'}
                          disabled={isPending}
                          className="px-2 disabled:pointer-events-none disabled:opacity-20"
                          onClick={() =>
                            setQuestInput((prev) =>
                              prev.filter((_, index) => index !== i)
                            )
                          }
                        >
                          <X className="size-6" />
                        </Button>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
                <Button
                  className="w-full disabled:opacity-20 md:w-auto"
                  onClick={() => handleCreateQuest}
                  disabled={isPending}
                >
                  新增題目到資料庫
                </Button>
              </AccordionContent>
            )}
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="md:text-lg">題組設定</span>
            </AccordionTrigger>
            {categoriesStatus === 'success' && (
              <AccordionContent className="p-4">
                <div className="flex gap-4">
                  {categories.length > 0 && <h2>題組資料集</h2>}
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-primary rounded-lg p-2"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
                <ul className="space-y-4 py-4">
                  {categoryInput.map((item, i) => (
                    <li
                      key={crypto.randomUUID()}
                      className="flex flex-wrap gap-4 md:flex-nowrap"
                    >
                      <Input
                        id="category"
                        type="text"
                        value={item}
                        placeholder="請輸入題庫名稱"
                        onChange={(e) => handleInputChange(e, i, 'category')}
                        onKeyUp={(e) => handleInputOnKeyEnter(e, i, 'category')}
                        className="disabled:pointer-events-none disabled:opacity-20"
                        disabled={isCategoryPending}
                      />
                      {categoryInput.length > 0 &&
                        i === categoryInput.length - 1 && (
                          <Button
                            className="flex-auto disabled:pointer-events-none disabled:opacity-20"
                            disabled={isCategoryPending}
                            onClick={() =>
                              setCategoryInput((prev) => [...prev, ''])
                            }
                          >
                            <PlusCircle className="me-2 size-6" />
                            增加項目
                          </Button>
                        )}
                      {categoryInput.length > 1 && (
                        <Button
                          variant={'destructive'}
                          disabled={isCategoryPending}
                          className="px-2 disabled:pointer-events-none disabled:opacity-20"
                          onClick={() =>
                            setCategoryInput((prev) =>
                              prev.filter((_, index) => index !== i)
                            )
                          }
                        >
                          <X className="size-6" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full md:w-auto"
                  onClick={() => handleCreateCategory}
                  disabled={isCategoryPending}
                >
                  新增題庫名稱到資料庫
                </Button>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Page;
