export const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full">
      <footer className="container relative">
        <p className="text-muted-foreground absolute bottom-2 w-full text-center text-sm">
          © {new Date().getFullYear()} By 黃士桓
        </p>
      </footer>
    </div>
  );
};
