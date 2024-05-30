'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/actions/category-actions';
import { getQuests } from '@/actions/quest-actions';
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
      const response = await getQuests();
      if (!response.state) {
        throw new Error(response.message);
      }
      return response.result.quests;
    },
  });

  const { data: categoriesData, status: categoriesStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.state) {
        throw new Error(response.message);
      }
      return response.result.categories;
    },
  });

  useEffect(() => {
    if (questsStatus === 'success' && questsData) {
      setQuests(questsData);
      setQuestsStatus('success');
    } else if (questsStatus === 'error') {
      setQuestsStatus('error');
    } else if (questsStatus === 'pending') {
      setQuestsStatus('pending');
    }
  }, [questsData, questsStatus, setQuests, setQuestsStatus]);

  useEffect(() => {
    if (categoriesStatus === 'success' && categoriesData) {
      setCategories(categoriesData);
      setCategoriesStatus('success');
    } else if (categoriesStatus === 'error') {
      setCategoriesStatus('error');
    } else if (categoriesStatus === 'pending') {
      setCategoriesStatus('pending');
    }
  }, [categoriesData, categoriesStatus, setCategories, setCategoriesStatus]);

  return null;
};

export default ClientProvider;
