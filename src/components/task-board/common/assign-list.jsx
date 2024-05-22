'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomPopover } from '@/components/ui/popover';
const list = [
  {
    name: 'Project Title',
  },
  {
    name: 'Dashtail Admin Template',
  },
  {
    name: 'User Template',
  },
];
const AssignList = () => {
  const [open, setOpen] = useState(false);
  const togglePopover = () => setOpen(!open);

  return (
    <CustomPopover
      trigger={
        <Button
          type="button"
          onClick={togglePopover}
          className="text-default-500 bg-transparent text-sm  font-medium hover:bg-transparent"
        >
          UI/UX Design
        </Button>
      }
      open={open}
      className={'left-[unset] right-0'}
      onClose={() => setOpen(false)}
    >
      <div className="bg-default-50 border-default-300 flex items-center  justify-between border-b px-3 py-2 ">
        <div className=" text-default-900 text-sm font-medium ">Task List </div>
        <Button
          type="button"
          size="icon"
          className="bg-default-400 size-6 rounded-full"
          onClick={togglePopover}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="p-2">
        <Command>
          <CommandInput
            placeholder="Search list..."
            inputWrapper="border border-default-200 rounded-md"
            className="h-9"
          ></CommandInput>
          <CommandEmpty>No Item found</CommandEmpty>
          <CommandGroup>
            {list.map((item, index) => (
              <CommandItem key={`assigned-list-item-${index}`}>
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div className="text-default-600 border-default-200 hover:bg-default-50 hover:decoration-primary cursor-pointer border-b px-4 py-1.5 text-sm font-medium hover:underline">
            Create a list
          </div>
        </DialogTrigger>
        <DialogContent size="lg" className="px-0">
          <DialogHeader className="border-default-300 border-b">
            <div className="text-default-900 pb-4 text-center text-lg font-medium">
              Create a list
            </div>
          </DialogHeader>

          <div className="p-4">
            <Label htmlFor="listname" className="mb-2">
              List Name
            </Label>
            <Input type="text" placeholder="example list.." />
          </div>
          <DialogFooter className=" px-4 sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CustomPopover>
  );
};

export default AssignList;
