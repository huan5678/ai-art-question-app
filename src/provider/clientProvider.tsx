'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import useQuestStore from '@/stores/questStore';

const ClientProvider = () => {
  const [setQuests, setCategories, setQuestsStatus, setCategoriesStatus] =
    useQuestStore((state) => [
      state.setQuests,
      state.setCategories,
      state.setQuestsStatus,
      state.setCategoriesStatus,
    ]);
  const { data: questsData, status: questsStatus } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await fetch('/api/quest');
      const { result } = await response.json();
      return result.quests;
    },
  });

  const { data: categoriesData, status: categoriesStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      const { result } = await response.json();
      return result.categories;
    },
  });

  useEffect(() => {
    setQuests(questsData);
    setQuestsStatus(questsStatus);
    setCategories(categoriesData);
    setCategoriesStatus(categoriesStatus);
  }, [
    questsData,
    categoriesData,
    setQuests,
    setCategories,
    setQuestsStatus,
    questsStatus,
    setCategoriesStatus,
    categoriesStatus,
  ]);

  return null;
};

export default ClientProvider;
