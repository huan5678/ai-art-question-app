import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Category, Quest } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { Icons } from '@/components/icons';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { TEditMenuOnEditProps } from '@/types/quest';

interface EditMenuProps<T, U> {
  title: string;
  onDelete: (id: string) => void;
  onEdit: (data: U) => void;
  children?: ReactNode;
  content: T;
}

const EditMenu = ({
  title,
  onDelete,
  onEdit,
  content,
}: EditMenuProps<Quest | Category, TEditMenuOnEditProps>) => {
  const [status, setStatus] = useState<string>('idle');
  const [isOpenDropdown, setIsOpenDropdown] = useState<string>('');

  const form = useForm({
    defaultValues: {
      content,
    },
  });

  const { control, handleSubmit, reset } = form;

  const { data: session } = useSession();

  const onSubmit = (data: { content: Quest | Category }) => {
    setStatus('pending');
    onEdit({
      ...data.content,
      userId: session?.user?.id as string,
    });
    reset();
    setStatus('idle');
  };

  return (
    <DropdownMenu
      open={content.id === isOpenDropdown}
      onOpenChange={(isOpen) =>
        isOpen ? setIsOpenDropdown(content.id) : setIsOpenDropdown('')
      }
    >
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Icons.menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col gap-1">
          <Dialog onOpenChange={(isOpen) => !isOpen && setIsOpenDropdown('')}>
            <DialogTrigger>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                編輯
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <DialogDescription>編輯{title}名稱</DialogDescription>
              <Form {...form}>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {'title' in content && (
                    <FormField
                      control={control}
                      name="content.title"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-auto md:flex-1">
                          <FormLabel>名稱</FormLabel>
                          <FormControl>
                            <Input
                              id={'content.title'}
                              type="text"
                              placeholder={'請輸入名稱'}
                              {...field}
                              className="disabled:pointer-events-none disabled:opacity-20"
                              disabled={status === 'pending'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {'name' in content && (
                    <FormField
                      control={control}
                      name="content.name"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-auto md:flex-1">
                          <FormLabel>名稱</FormLabel>
                          <FormControl>
                            <Input
                              id={'content.name'}
                              type="text"
                              placeholder={'請輸入名稱'}
                              {...field}
                              className="disabled:pointer-events-none disabled:opacity-20"
                              disabled={status === 'pending'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {'description' in content && (
                    <FormField
                      control={control}
                      name="content.description"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-auto md:flex-1">
                          <FormLabel>描述</FormLabel>
                          <FormControl>
                            <Input
                              id={'content.description'}
                              type="text"
                              placeholder={'請輸入描述'}
                              {...field}
                              value={field.value ?? ''}
                              className="disabled:pointer-events-none disabled:opacity-20"
                              disabled={status === 'pending'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
              <DialogFooter>
                <Button type="submit">送出</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    取消
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <Dialog onOpenChange={(isOpen) => !isOpen && setIsOpenDropdown('')}>
            <DialogTrigger>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                刪除
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <DialogDescription>
                確定要刪除
                <span className="mx-1 font-bold text-red-500 dark:text-red-400">
                  {title}
                </span>
                嗎？
              </DialogDescription>
              <DialogFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={() => onDelete(content.id)}
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

export default EditMenu;
