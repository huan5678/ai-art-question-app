import { Navbar } from '@/components/navbar/navbar';
import AuthProvider from '@/provider/authProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <main className="flex-1">
        <Navbar />
        {children}
      </main>
    </AuthProvider>
  );
}
