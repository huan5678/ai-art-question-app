'use client';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { UserPlus, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CustomPopover,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
const members = [
  {
    name: 'Nick Jonas',
    value: 'userid1',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Fahim',
    value: 'userid2',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Nayeem',
    value: 'userid3',
    image: faker.image.avatarLegacy(),
  },
  {
    name: 'Iftekhar',
    value: 'userid4',
    image: faker.image.avatarLegacy(),
  },
];
const AssignMembers = ({ icon }) => {
  const [open, setOpen] = useState(false);
  const togglePopover = () => setOpen(!open);

  return (
    <CustomPopover
      trigger={
        <button
          className="bg-default-100 grid size-5 place-content-center rounded-full"
          onClick={togglePopover}
        >
          {icon ? icon : <UserPlus className="text-primary size-3" />}
        </button>
      }
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="bg-default-50 border-default-300 flex items-center  justify-between border-b px-3 py-2">
        <div className=" text-default-900 text-sm font-medium ">
          Assign Task To
        </div>
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
            placeholder="Search By Name..."
            inputWrapper="border border-default-200 rounded-md"
            className="h-9"
          ></CommandInput>
          <CommandEmpty>No new members.</CommandEmpty>
          <CommandGroup>
            {members.map((item) => (
              <CommandItem
                key={`assigned-members-${item.value}`}
                value={item.name}
                className="gap-2"
              >
                <Avatar className="size-8">
                  <AvatarImage src={item.image} />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <span className="font-base text-default-900 capitalize">
                  {item.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </div>
    </CustomPopover>
  );
};

export default AssignMembers;
