import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { TopNav } from './TopNav';

export const AppShell = () => (
  <div className="flex min-h-screen flex-col bg-bg text-fg">
    <TopNav />
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12">
      <Outlet />
    </main>
    <Footer />
  </div>
);
