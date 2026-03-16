'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { SocketProvider, useSocket } from '@/lib/socketContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const FULL_SCREEN_PATHS = ['/login', '/onboarding'];

// Componente interno para acceder al hook useSocket
const SocketListener = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Escuchar notificaciones enviadas por el servidor
    socket.on('notification', (data: { title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning' }) => {
      const type = data.type || 'info';
      toast[type](data.title, {
        description: data.message,
      });
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  return null;
};

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
      <SocketListener />
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
