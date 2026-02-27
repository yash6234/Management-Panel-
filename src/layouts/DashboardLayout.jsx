import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import { SearchProvider } from '../context/SearchContext';

export default function DashboardLayout() {
  return (
    <SearchProvider>
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex min-h-0 flex-1 flex-col overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
