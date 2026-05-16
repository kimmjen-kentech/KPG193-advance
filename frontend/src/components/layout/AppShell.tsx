import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { TopNav } from './TopNav';

export const AppShell = () => (
  <div className="flex min-h-screen flex-col bg-bg text-fg">
    <TopNav />
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Outlet />
    </main>
    <Footer />
  </div>
);
