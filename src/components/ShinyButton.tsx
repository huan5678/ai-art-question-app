import { type ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ShinyButton = ({ children }: { children: ReactNode }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const animate = () => {
      const element = buttonRef.current;
      if (!element) return;

      element.style.setProperty('--x', '100%');
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const xValue = 100 - ((progress / 10) % 200);
        element.style.setProperty('--x', `${xValue}%`);

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    animate();
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.97 }}
      className="radial-gradient relative overflow-hidden rounded-md px-6 py-2"
    >
      <span className="linear-mask relative block size-full font-light tracking-wide text-neutral-100">
        {children}
      </span>
      <span className="linear-overlay absolute inset-0 block rounded-md p-px" />
    </motion.button>
  );
};

export default ShinyButton;
