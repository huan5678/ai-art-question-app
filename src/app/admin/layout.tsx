'use client';
import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { checkUserRole } from '@/actions/account-actions';
import Layout from '@/components/layout';
import Sidebar from '@/components/Siderbar';
import links from '@/mocks/links';
import AuthProvider from '@/provider/authProvider';

export const AdminTemplate = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      if (session?.user?.id) {
        const userRole = await checkUserRole(session.user.id);

        if (userRole !== 'admin') {
          router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    };

    if (session) {
      checkRole();
    }
  }, [session, router]);

  return children;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminTemplate>
        <main className="flex max-h-screen overflow-hidden">
          <Sidebar links={links} socials={[]} />
          <Layout>
            <div className="relative w-full">{children}</div>
          </Layout>
        </main>
      </AdminTemplate>
    </AuthProvider>
  );
}
