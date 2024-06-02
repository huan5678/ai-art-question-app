import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
import type {
  Category,
  ColumnMapping,
  TEditMenuOnEditProps,
} from '@/types/quest';

interface EditMenuProps<T> {
  title: string;
  onDelete: (id: string) => Promise<void>;
  onEdit: (data: TEditMenuOnEditProps) => Promise<void>;
  content: T;
}

const EditMenu = ({
  title,
  onDelete,
  onEdit,
  content,
}: EditMenuProps<ColumnMapping | Category>) => {
  const [status, setStatus] = useState<string>('idle');
  const [isOpenDropdown, setIsOpenDropdown] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      content,
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: { content: ColumnMapping | Category }) => {
    setStatus('pending');
    onEdit({
      ...data.content,
    });
    reset();
    setStatus('idle');
    setIsOpenDropdown('');
    setIsEditDialogOpen(false);
  };

  const handleDialogClose = () => {
    setStatus('idle');
    setIsOpenDropdown('');
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleDialogClose();
    }
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
          <Dialog open={isEditDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsEditDialogOpen(true);
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
              <DialogDescription>編輯 {title} 名稱</DialogDescription>
              <Form {...form}>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {'title' in content && (
                    <FormField
                      control={control}
                      name="content.title"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-auto md:flex-1">
                          <FormLabel htmlFor={'content.title'}>名稱</FormLabel>
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
                          <FormLabel htmlFor={'content.name'}>名稱</FormLabel>
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
                  <FormField
                    control={control}
                    name="content.description"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-auto md:flex-1">
                        <FormLabel htmlFor={'content.description'}>
                          描述
                        </FormLabel>
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
                  <DialogFooter>
                    <Button type="submit">送出</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        取消
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <Dialog open={isDeleteDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
                }}
              >
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
