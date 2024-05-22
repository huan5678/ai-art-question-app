'use client';

import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const SubTaskHeader = () => {
  return (
    <form className="border-default-200 border-b px-6 py-5 pb-8">
      <div className="mb-2 flex items-center gap-1">
        <div className="mt-1">
          <Checkbox className="size-4" color="secondary" />
        </div>
        <input
          type="text"
          defaultValue="Project Title"
          className="text-default-900 focus:border-default-200 focus:bg-default-50 h-7 w-full rounded-sm px-1 text-sm font-medium focus:border focus:outline-none"
        />
      </div>

      <div className="relative flex gap-1">
        <div className="mt-1">
          <Icon
            icon="heroicons:information-circle"
            className="text-default-900 size-5"
          />
        </div>
        <textarea
          className="text-default-700 peer h-16 w-full border-none p-1 text-sm focus:border-none focus:outline-none"
          placeholder="Add Task Descriptions"
          rows="1"
        />
        <Button className="  h-6 py-0 text-xs" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default SubTaskHeader;
