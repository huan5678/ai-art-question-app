import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const Watermark = ({
  reverse,
  text,
  className,
}: {
  reverse: boolean;
  text: string;
  className?: string;
}) => (
  <div className="flex -translate-y-12 select-none overflow-hidden">
    <TranslateWrapper reverse={reverse}>
      <span
        className={cn(
          'w-fit whitespace-nowrap text-[20vmax] font-black uppercase leading-[0.75] text-slate-300',

          className
        )}
      >
        {text}
      </span>
    </TranslateWrapper>
    <TranslateWrapper reverse={reverse}>
      <span
        className={cn(
          'ml-48 w-fit whitespace-nowrap text-[20vmax] font-black uppercase leading-[0.75] text-slate-300',
          className
        )}
      >
        {text}
      </span>
    </TranslateWrapper>
  </div>
);

const TranslateWrapper = ({
  children,
  reverse,
}: {
  children: ReactNode;
  reverse: boolean;
}) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? '-100%' : '0%' }}
      animate={{ translateX: reverse ? '0%' : '-100%' }}
      transition={{
        duration: 75,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
      className="flex"
    >
      {children}
    </motion.div>
  );
};

export default Watermark;
