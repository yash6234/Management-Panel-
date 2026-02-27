import { useOutletContext } from 'react-router-dom';
import { Users, Fuel, Briefcase, ShoppingCart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const stats = [
  { id: 'persons', label: 'Persons', icon: Users },
  { id: 'diesel', label: 'Vehicle Entries', icon: Fuel },
  { id: 'commission', label: 'Commission/Labour', icon: Briefcase },
  { id: 'sales', label: 'Sales Entries', icon: ShoppingCart },
];

export default function DashboardHome() {
  const {
    persons = [],
    dieselEntries = [],
    commissionLabour = [],
    salesEntries = [],
  } = useOutletContext();
  const statValues = {
    persons: persons.length,
    diesel: dieselEntries.length,
    commission: commissionLabour.length,
    sales: salesEntries.length,
  };

  const recentActivity = salesEntries
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-[#0F766E]/10 p-3">
                <Icon className="h-6 w-6 text-[#0F766E]" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800">
                  {statValues[id] ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0F766E]" />
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No sales activity yet. Add entries from the Sales page.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Products</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Deposit</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((entry) => (
                    <tr key={entry.id} className="border-b border-[#E5E7EB] hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">{entry.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {entry.date ? format(new Date(entry.date), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{entry.salesOfProducts || '—'}</td>
                      <td className="px-4 py-3 text-slate-700">{entry.deposit || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
