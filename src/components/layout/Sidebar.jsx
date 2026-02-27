import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, Database, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/masters', label: 'Masters', icon: Users },
  { to: '/dashboard/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/dashboard/data', label: 'Data', icon: Database },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-[#E5E7EB] px-6">
        <h1 className="text-xl font-bold text-[#0F766E]">Management Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F766E]'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[#E5E7EB] p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
