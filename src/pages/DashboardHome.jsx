import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  TrendingUp,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import { detailGridClass } from '../components/ui/DetailCard';

const cards = [
  {
    title: 'Dashboard',
    description: 'Overview of all management panel sections and quick stats.',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Masters',
    description: 'Manage Person, Diesel, and Commission/Labour master data.',
    icon: Users,
    path: '/dashboard/masters',
  },
  {
    title: 'Sales',
    description: 'View personal details and full-screen calendar for sales.',
    icon: ShoppingCart,
    path: '/dashboard/sales',
  },
];

export default function DashboardHome() {
  const { persons, dieselEntries, commissionLabour } = useApp();
  const { searchQuery } = useSearch();

  const matchesSearch = (text, query) => {
    if (!query.trim()) return true;
    return String(text).toLowerCase().includes(query.trim().toLowerCase());
  };

  const filteredCards = searchQuery.trim()
    ? cards.filter(
        (c) =>
          matchesSearch(c.title, searchQuery) ||
          matchesSearch(c.description, searchQuery)
      )
    : cards;

  const stats = [
    { label: 'Persons', value: persons.length, icon: Users },
    { label: 'Diesel entries', value: dieselEntries.length, icon: BarChart3 },
    { label: 'Commission/Labour', value: commissionLabour.length, icon: FileText },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Default overview of all pages and related data in the management panel.
        </p>
      </div>

      <div className={`mb-8 ${detailGridClass}`}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Panel sections</h2>
        <p className="text-sm text-slate-600">
          All sections available in this management panel and what they contain.
        </p>
      </div>
      <div className={detailGridClass}>
        {filteredCards.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
              <Icon className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">Quick summary</h2>
        </div>
        <p className="text-slate-600">
          Use the sidebar to navigate to <strong>Masters</strong> to add Person, Diesel, and Commission/Labour entries. 
          All added personal details and related data appear in <strong>Sales</strong> along with the full-screen calendar.
        </p>
      </div>
    </div>
  );
}
