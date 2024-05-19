import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const passwordRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},./\\;'[\]-]).{8,}$/;

export const passwordCheck = (password: string) => {
  return passwordRule.test(password);
};
