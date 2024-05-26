'use client';

import { useState } from 'react';
import type { Category } from '@prisma/client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';

interface QuestColumnMenuProps {
  category: Category;
}

const QuestColumnMenu = ({ category }: QuestColumnMenuProps) => {
  const [categoriesStatus, updateCategory, deleteCategory] = useQuestStore(
    (state) => [
      state.categoriesStatus,
      state.updateCategory,
      state.deleteCategory,
    ]
  );
  const [isOpenDropdown, setIsOpenDropdown] = useState<string>('');

  const [editCategory, setEditCategory] = useState<Category | null>();

  const handleUpdateCategory = async () => {
    if (!editCategory) return;
    await updateCategory(editCategory.id, editCategory.name);
    setEditCategory(null);
  };

  const onDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  return (
    <DropdownMenu
      key={category.id}
      open={category.id === isOpenDropdown}
      onOpenChange={(isOpen) =>
        isOpen ? setIsOpenDropdown(category.id) : setIsOpenDropdown('')
      }
    >
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Icons.menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-56')}>
        <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1">
          <Dialog onOpenChange={(isOpen) => !isOpen && setIsOpenDropdown('')}>
            <DialogTrigger>
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
                <DialogTitle>{category.name}</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <DialogDescription>請輸入新的題庫名稱</DialogDescription>
              <Label htmlFor={category.id}>編輯題庫名稱</Label>
              <Input
                id={category.id}
                type="text"
                defaultValue={category.name}
                value={editCategory?.name}
                className="disabled:pointer-events-none disabled:opacity-20"
                disabled={categoriesStatus === 'pending'}
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
          <Dialog onOpenChange={(isOpen) => !isOpen && setIsOpenDropdown('')}>
            <DialogTrigger>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                刪除
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{category.name}</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <DialogDescription>確定要刪除此題庫名稱？</DialogDescription>
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
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuestColumnMenu;
