'use client';
import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { Icons } from '@/components/icons';
import { animatePageOut } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { ILinksProps } from '@/types/types';

const ToggleButton = ({ visible }: { visible: boolean }) => {
  const { theme, setTheme } = useTheme();
  return (
    <motion.button
      className={cn(
        'flex h-[72px] w-full items-center gap-3 overflow-hidden whitespace-nowrap pl-6 text-left text-[color:var(--n4)] transition-all duration-[0.5s] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:text-[color:var(--n2)] dark:text-[color:var(--n6)] hover:dark:text-[color:var(--n8)]',
        { 'w-auto pe-6 items-start pt-1': !visible }
      )}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <div
        className={cn(
          'shrink-0 stroke-[color:var(--n4)] hover:stroke-[color:var(--n1)] hover:transition-all hover:duration-[0.5s] hover:ease-[cubic-bezier(0.25,0.1,0.25,1)] active:stroke-[color:var(--n1)] dark:stroke-[color:var(--n6)] dark:hover:stroke-[color:var(--n8)] dark:active:stroke-[color:var(--n8)]'
        )}
        aria-label="Toggle theme"
      >
        <Icons.sun className="dark:hidden" />
        <Icons.moon className="hidden dark:block" />
      </div>
    </motion.button>
  );
};

const Sidebar: FC<ILinksProps> = ({ links, socials = [] }) => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (href: string) => {
    if (pathname !== href) {
      animatePageOut(href, router);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const socialsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <aside
      className={cn(
        'bg-background sticky left-0 top-0 z-[1] flex h-screen w-[250px] flex-col py-16 transition-all duration-[0.5s] ease-[cubic-bezier(0.22,0.61,0.36,1)]',
        { 'w-[72px]': visible }
      )}
    >
      <div
        className={cn('flex items-start justify-between', {
          'flex-col': visible,
        })}
      >
        <button
          type="button"
          className={cn(
            'before:bg-primary after:bg-primary relative z-[15] mb-6 ms-5 block size-8 before:absolute before:left-1.5 before:top-4 before:h-0.5 before:w-5 before:-translate-y-1 before:rounded-sm before:transition-transform before:duration-[0.2s] before:content-[""] after:absolute after:left-1.5 after:top-4 after:h-0.5 after:w-5 after:translate-y-[3px] after:rounded-sm after:transition-transform after:duration-[0.2s] after:content-[""]',
            {
              'before:translate-y-0 before:-rotate-45 after:translate-y-0 after:rotate-45':
                !visible,
            }
          )}
          onClick={() => setVisible(!visible)}
        />
        <ToggleButton visible={visible} />
      </div>

      <motion.nav
        variants={container}
        initial="hidden"
        animate="show"
        className="links"
      >
        {links.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons];
          return (
            <Link href={item.url} key={item.title}>
              <motion.button
                variants={itemVariant}
                key={item.title}
                className={cn(
                  'flex h-[72px] w-full items-center gap-3 overflow-hidden whitespace-nowrap pl-6 text-left text-[color:var(--n4)] transition-all duration-[0.5s] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:text-[color:var(--n2)] dark:text-[color:var(--n6)] hover:dark:text-[color:var(--n8)]',
                  {
                    'text-[color:var(--n1)] dark:text-[color:var(--n8)]':
                      pathname === item.url,
                  }
                )}
                onClick={() => handleClick(item.url)}
              >
                <IconComponent
                  className={cn(
                    'shrink-0 stroke-[color:var(--n4)] hover:stroke-[color:var(--n1)] hover:transition-all hover:duration-[0.5s] hover:ease-[cubic-bezier(0.25,0.1,0.25,1)] active:stroke-[color:var(--n1)] dark:stroke-[color:var(--n6)] dark:hover:stroke-[color:var(--n8)] dark:active:stroke-[color:var(--n8)]'
                  )}
                />
                <motion.span
                  animate={{ opacity: visible ? 0 : 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {item.title}
                </motion.span>
              </motion.button>
            </Link>
          );
        })}
      </motion.nav>
      <motion.nav
        variants={socialsVariants}
        className="mt-auto flex gap-6 px-6 transition-[0.2s] duration-[all] ease-[ease-in-out]"
        animate={visible ? 'hidden' : 'visible'}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {socials.length > 0 &&
          socials.map(async (item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons];
            return (
              <motion.a
                key={item.url}
                className="mt-auto flex gap-6 px-6 transition-[0.2s] duration-[all] ease-[ease-in-out]"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
              >
                <IconComponent />
              </motion.a>
            );
          })}
      </motion.nav>
    </aside>
  );
};

export default Sidebar;
