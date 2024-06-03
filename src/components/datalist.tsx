'use client';

import { useRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/quest';

export function DataList({
  id,
  data,
  onSelect,
  disabled,
  value,
}: {
  id: string;
  data: Category[];
  onSelect: (category: string) => void;
  disabled?: boolean;
  value?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>(data);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [selectedValue, setSelectedValue] = useState<Category | undefined>();

  const createCategory = (name: string) => {
    const newCategory = {
      id: uuidv4(),
      name,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const toggleCategory = (category: Category) => {
    setSelectedValue(category);
    setOpenCombobox(false);
    onSelect(category.name);
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="text-foreground w-[200px] justify-between"
            disabled={disabled}
          >
            <span className="text-foreground truncate">
              {!selectedValue && '選擇題庫'}
              {selectedValue?.name}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              id={id}
              ref={inputRef}
              placeholder="搜尋題庫..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {categories?.map((category) => {
                  const isActive = selectedValue?.id === category.id;
                  return (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => toggleCategory(category)}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          isActive ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1">{category.name}</div>
                    </CommandItem>
                  );
                })}
                <CommandItemCreate
                  onSelect={() => createCategory(inputValue)}
                  {...{ inputValue, categories }}
                />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const CommandItemCreate = ({
  inputValue,
  categories,
  onSelect,
}: {
  inputValue: string;
  categories: Category[];
  onSelect: () => void;
}) => {
  const hasNoCategory = !categories
    ?.map(({ name }) => name.toLowerCase())
    .includes(inputValue.toLowerCase());

  const render = inputValue !== '' && hasNoCategory;

  if (!render) return null;

  return (
    <CommandItem
      key={inputValue}
      value={inputValue}
      className="text-muted-foreground text-xs"
      onSelect={onSelect}
    >
      <div className={cn('mr-2 size-4')} />
      建立新的題庫: &quot;{inputValue}&quot;
    </CommandItem>
  );
};
