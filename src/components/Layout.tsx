import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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