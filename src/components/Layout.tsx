'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { SocketProvider } from '@/lib/socketContext';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const FULL_SCREEN_PATHS = ['/login', '/onboarding'];

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_PATHS.some(p => pathname.startsWith(p));
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Intentamos obtener el ID de la empresa para unirnos a su sala de sockets
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.company_id) {
          setCompanyId(data.user.company_id);
        }
      })
      .catch(() => {});
  }, [pathname]);

  if (isFullScreen) {
    return <>{children}</>;
  }

  return (
    <SocketProvider companyId={companyId}>
      <div className="app-container">
        <Sidebar />
        <main className="app-content">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
};

export default Layout;
