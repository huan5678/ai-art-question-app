'use client';

import type { Category, Quest } from '@prisma/client';

import EditMenu from '../(EditMenu)';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useQuestStore from '@/stores/questStore';
import type { TEditMenuOnEditProps } from '@/types/quest';

interface QuestTableProps {
  quests: Quest[];
}

export function QuestTable({ quests }: QuestTableProps) {
  const [categories, updateQuest, deleteQuest] = useQuestStore((state) => [
    state.categories,
    state.updateQuest,
    state.deleteQuest,
  ]);

  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find(
      (category: Category) => category.id === categoryId
    );
    return category?.name || '未指定題庫';
  };

  const handleUpdateQuest = async (data: TEditMenuOnEditProps) => {
    await updateQuest(data as Quest);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">題目名稱</TableHead>
          <TableHead className="text-center">題目描述</TableHead>
          <TableHead className="text-center">題庫</TableHead>
          <TableHead className="text-right">使用次數</TableHead>
          <TableHead className="text-center">建立時間</TableHead>
          <TableHead className="text-right">{''}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quests.map((quest) => (
          <TableRow key={quest.id}>
            <TableCell className="font-medium">{quest.title}</TableCell>
            <TableCell>{quest.description}</TableCell>
            <TableCell className="text-center">
              {getCategoryName(quest.categoryId)}
            </TableCell>
            <TableCell className="text-right">{quest.accessCount}</TableCell>
            <TableCell className="text-right">
              {new Date(quest.createdAt).toLocaleString()}
            </TableCell>
            <TableCell className="flex justify-end">
              <EditMenu
                title={quest.title}
                content={quest}
                onEdit={handleUpdateQuest}
                onDelete={deleteQuest}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default QuestTable;
