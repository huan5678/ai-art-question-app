import { ThemeToggle } from '@/components/theme-toggle';

export const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full">
      <footer className="container relative">
        <p className="text-muted-foreground absolute bottom-2 w-full text-center text-sm">
          © {new Date().getFullYear()} By 黃士桓
        </p>
        <ThemeToggle className="absolute bottom-2 right-2" />
      </footer>
    </div>
  );
};
