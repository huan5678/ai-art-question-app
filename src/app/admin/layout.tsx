import AuthProvider from '@/provider/authProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <main className="flex-1">{children}</main>
    </AuthProvider>
  );
}
