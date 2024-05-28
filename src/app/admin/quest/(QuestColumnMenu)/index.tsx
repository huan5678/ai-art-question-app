'use client';

import type { Category } from '@prisma/client';

import EditMenu from '../../(EditMenu)';

import type { TEditMenuOnEditProps } from '@/types/quest';

interface QuestColumnMenuProps {
  category: Category;
  onDelete: (id: string) => Promise<void>;
  onEdit: (data: TEditMenuOnEditProps) => Promise<void>;
}

const QuestColumnMenu = ({
  category,
  onDelete,
  onEdit,
}: QuestColumnMenuProps) => {
  return (
    <EditMenu
      title={category.name}
      onDelete={onDelete}
      onEdit={onEdit}
      content={category}
    />
  );
};

export default QuestColumnMenu;
