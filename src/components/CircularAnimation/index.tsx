import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface CircularAnimationProps {
  title: string;
  children: ReactNode;
  disabled: boolean;
  onClick?: () => void;
}

const CircularAnimation = ({
  title,
  children,
  disabled,
  onClick,
}: CircularAnimationProps) => {
  return (
    <button
      type="button"
      className={cn(
        'relative block select-none',
        disabled && 'cursor-default opacity-50'
      )}
      onClick={onClick}
    >
      <motion.svg
        viewBox="0 0 200 200"
        className={cn(
          'size-[200px] origin-center',
          !disabled && 'animate-rotated-text'
        )}
      >
        <title>Circular Animation</title>
        <defs>
          <path
            id="circle"
            d={`
                M 100, 100
                m -75, 0
                a 75,75 0 1,0 150,0
                a 75,75 0 1,0 -150,0
              `}
          />
        </defs>
        <text width="400" textLength={Math.PI * 150}>
          <textPath
            alignmentBaseline={'central'}
            xlinkHref="#circle"
            className={cn(
              'origin-[250px_250px] fill-[var(--n2)] text-sm font-light leading-6 tracking-[1.7px] dark:fill-[var(--n6)]',
              disabled && 'opacity-50'
            )}
            textLength={Math.PI * 150}
          >
            {title} ・ {title} ・ {title} ・
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2">
        {children}
      </span>
    </button>
  );
};

export default CircularAnimation;
