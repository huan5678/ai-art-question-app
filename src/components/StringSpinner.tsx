'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInterval } from 'usehooks-ts';

import useConfigurationStore from '@/stores/setupStore';
import type { Quest } from '@/types/quest';

interface StringSpinnerProps {
  strings: Quest[];
  interval?: number;
}

const StringSpinner = ({
  strings = [
    {
      index: '',
      id: '',
      title: '',
      description: '',
      category: '',
    },
  ],
  interval = 150,
}: StringSpinnerProps) => {
  const [drawCount] = useConfigurationStore((state) => [state.drawCount]);
  const [index, setIndex] = useState(0);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const itemHeightRef = useRef(0);
  useEffect(() => {
    if (itemRef.current) {
      itemHeightRef.current = itemRef.current.clientHeight;
    }
  }, []);

  const itemIndexesToShow = Array.from(
    { length: drawCount > 3 ? 3 : drawCount },
    (_, i) => {
      return (index + i) % strings.length;
    }
  );

  useInterval(() => {
    setIndex((prev) => (prev + 1) % strings.length);
  }, interval);

  const itemsToShow = useCallback(() => {
    return itemIndexesToShow.map((idx) => strings[idx]);
  }, [strings, itemIndexesToShow]);

  return (
    <motion.div
      layout
      className="flex flex-col items-center justify-center gap-2 divide-y overflow-hidden"
      style={{ height: `${drawCount * (itemHeightRef.current || 100) + 24}px` }}
    >
      {itemsToShow().map((item, i) => (
        <motion.div
          layout
          initial={{ y: -50 }}
          animate={{ y: 25 }}
          exit={{ y: 50 }}
          transition={{ duration: 0.3, delay: i * 0.2 }}
          key={item?.id}
          ref={itemRef}
          className="grid place-items-center text-center text-xl md:text-6xl"
          style={{ height: `${itemHeightRef.current}px` }}
        >
          <div ref={i === 0 ? itemRef : null}>{item?.title}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StringSpinner;
