'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const FULL_SCREEN_PATHS = ['/login', '/onboarding'];

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_PATHS.some(p => pathname.startsWith(p));

  if (isFullScreen) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
