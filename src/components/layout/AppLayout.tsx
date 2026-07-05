import { Outlet } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  useAppData();
  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <Sidebar />
      <main className="md:pl-64 pb-24 md:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
