import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import { SearchProvider } from '../context/SearchContext';

export default function DashboardLayout() {
  return (
    <SearchProvider>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
