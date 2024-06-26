'use client';

import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@prisma/client';
import { motion } from 'framer-motion';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryInputProps {
  categories: Category[];
  onCreateCategory: (categoryName: string) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  status: boolean;
}

const categoryInputSchema = z.object({
  category: z.string().min(1).max(50),
});

const CategoryInput: FC<CategoryInputProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  status,
}) => {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm({
    defaultValues: {
      category: '',
    },
    resolver: zodResolver(categoryInputSchema),
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: { category: string }) => {
    onCreateCategory(data.category);
    reset();
  };

  const handleUpdateCategory = () => {
    if (editCategory) {
      onUpdateCategory(editCategory);
      setEditCategory(null);
    }
  };

  useEffect(() => {
    status && setIsPending(false);
  }, [status]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
          {categories && categories.length > 0 && <h2>題組資料集</h2>}
          {categories?.map((category) => (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{category.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setEditCategory(category);
                      }}
                    >
                      編輯
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editCategory?.name}</DialogTitle>
                      <DialogClose />
                    </DialogHeader>
                    <DialogDescription>請輸入新的題庫名稱</DialogDescription>
                    <Label htmlFor={editCategory?.id}>編輯題庫名稱</Label>
                    <Input
                      id={editCategory?.id}
                      type="text"
                      defaultValue={editCategory?.name}
                      value={editCategory?.name}
                      className="disabled:pointer-events-none disabled:opacity-20"
                      disabled={isPending}
                      onChange={(e) => {
                        setEditCategory({
                          ...category,
                          name: e.target.value,
                        });
                      }}
                    />

                    <DialogFooter>
                      <Button type="button" onClick={handleUpdateCategory}>
                        送出
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          取消
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      刪除
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{category.name}</DialogTitle>
                      <DialogClose />
                    </DialogHeader>
                    <DialogDescription>
                      確定要刪除此題庫名稱？
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="destructive"
                        onClick={() => onDeleteCategory(category.id)}
                      >
                        確定
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          取消
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        <motion.ul layout className="mb-4 space-y-4">
          <motion.li
            layout
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-end gap-4 md:flex-nowrap"
          >
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>題庫名稱</FormLabel>
                  <FormControl>
                    <Input
                      id="category"
                      placeholder="請輸入題庫名稱"
                      {...field}
                      className="disabled:pointer-events-none disabled:opacity-20"
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto"
            >
              新增題庫名稱到資料庫
            </Button>
          </motion.li>
        </motion.ul>
      </form>
    </Form>
  );
};

export default CategoryInput;
