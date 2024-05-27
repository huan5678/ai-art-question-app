'use client';

import type { Category } from '@prisma/client';

import EditMenu from '../../(EditMenu)';

import type { CategoryType, TEditMenuOnEditProps } from '@/types/quest';

interface QuestColumnMenuProps {
  category: Category;
  onDelete: (id: string) => void;
  onEdit: (data: CategoryType) => void;
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
      onEdit={(data: TEditMenuOnEditProps) => onEdit(data as CategoryType)}
      content={category}
    />
  );
};

export default QuestColumnMenu;
