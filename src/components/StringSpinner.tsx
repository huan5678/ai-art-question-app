'use client';

import { useState } from 'react';
import type { Quest } from '@prisma/client';
import { motion } from 'framer-motion';
import { useInterval } from 'usehooks-ts';

import useConfigurationStore from '@/stores/setupStore';

interface StringSpinnerProps {
  strings: Quest[];
  interval?: number;
}

const StringSpinner = ({ strings, interval = 100 }: StringSpinnerProps) => {
  const [drawCount] = useConfigurationStore((state) => [state.drawCount]);
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex((prevIndex) => (prevIndex + 1) % strings.length);
  }, interval);

  // 計算需要顯示的字符串索引
  const itemIndexesToShow = Array.from({ length: drawCount }, (_, i) => {
    return (index + i) % strings.length;
  });

  // 需要顯示的字符串
  const itemsToShow = itemIndexesToShow.map((idx) => strings[idx]);
  const itemHeight = `${100 / drawCount}%`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-stretch justify-center gap-2 divide-y overflow-hidden"
      style={{ height: `${drawCount * 100}px` }}
    >
      {itemsToShow.map((item, i) => (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          key={item.id}
          className="inline-block flex-1 text-center text-lg md:text-6xl"
          style={{ height: itemHeight }}
        >
          {item.title}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StringSpinner;
