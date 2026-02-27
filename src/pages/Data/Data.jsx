import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Fuel, Briefcase, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import DetailCard, { dataGridClass } from './DetailCard';

export default function Data() {
  const {
    persons = [],
    dieselEntries = [],
    commissionLabour = [],
    salesEntries = [],
  } = useOutletContext();
  const [activeTab, setActiveTab] = useState('persons');
  const [searchQuery, setSearchQuery] = useState('');

  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return String(text).toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  const filteredPersons = (persons || []).filter(
    (p) =>
      matchesSearch(p.name) ||
      matchesSearch(p.mobile) ||
      matchesSearch(p.email) ||
      matchesSearch(p.address)
  );
  const filteredDiesel = (dieselEntries || []).filter(
    (d) => matchesSearch(d.name) || matchesSearch(String(d.amount))
  );
  const filteredCommission = (commissionLabour || []).filter(
    (c) => matchesSearch(c.name) || matchesSearch(String(c.amount))
  );
  const filteredSales = (salesEntries || []).filter(
    (s) =>
      matchesSearch(s.name) ||
      matchesSearch(s.salesOfProducts) ||
      matchesSearch(s.deposit) ||
      matchesSearch(s.location)
  );

  const tabClass = (tab) =>
    `flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'border-[#0F766E] bg-white text-[#0F766E]'
        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
    }`;

  return (
    <div className="p-6 lg:p-8">
      <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        <div className="mb-4 flex items-center gap-4 border-b border-[#E5E7EB] px-6 pt-4 pb-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="max-w-xs rounded-lg border border-[#E5E7EB] bg-slate-50 py-2 px-4 text-slate-800 placeholder-slate-500 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
          />
          <div className="flex gap-0">
            <button type="button" className={tabClass('persons')} onClick={() => setActiveTab('persons')}>
              <Users className="h-4 w-4" />
              Personal Details ({persons.length})
            </button>
            <button type="button" className={tabClass('diesel')} onClick={() => setActiveTab('diesel')}>
              <Fuel className="h-4 w-4" />
              Vehicle ({dieselEntries.length})
            </button>
            <button type="button" className={tabClass('commission')} onClick={() => setActiveTab('commission')}>
              <Briefcase className="h-4 w-4" />
              Commission/Labour ({commissionLabour.length})
            </button>
            <button type="button" className={tabClass('sales')} onClick={() => setActiveTab('sales')}>
              <ShoppingCart className="h-4 w-4" />
              Sales ({salesEntries.length})
            </button>
          </div>
        </div>

        <div className="p-6 pt-4">
          {activeTab === 'persons' && (
            filteredPersons.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No persons added yet.</p>
            ) : (
              <div className={dataGridClass}>
                {filteredPersons.map((p) => (
                  <DetailCard
                    key={p.id || p._id}
                    title={p.name}
                    className="h-full"
                    fields={[
                      { label: 'M.no', value: p.mobile },
                      { label: 'Email', value: p.email },
                      { label: 'Address', value: p.address },
                    ]}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'diesel' && (
            filteredDiesel.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No vehicle entries yet.</p>
            ) : (
              <div className={dataGridClass}>
                {filteredDiesel.map((d) => (
                  <DetailCard
                    key={d.id}
                    title={d.name}
                    className="h-full"
                    fields={[{ label: 'Amount', value: String(d.amount ?? '—') }]}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'commission' && (
            filteredCommission.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No commission/labour entries yet.</p>
            ) : (
              <div className={dataGridClass}>
                {filteredCommission.map((c) => (
                  <DetailCard
                    key={c.id}
                    title={c.name}
                    className="h-full"
                    fields={[{ label: 'Amount', value: String(c.amount ?? '—') }]}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'sales' && (
            filteredSales.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No sales entries yet.</p>
            ) : (
              <div className={dataGridClass}>
                {filteredSales.map((s) => (
                  <DetailCard
                    key={s.id}
                    title={s.name || '—'}
                    className="h-full"
                    fields={[
                      { label: 'Date', value: s.date ? format(new Date(s.date), 'MMM d, yyyy') : '—' },
                      { label: 'Products', value: s.salesOfProducts },
                      { label: 'Deposit', value: s.deposit },
                      { label: 'Credit', value: s.credit },
                      { label: 'Location', value: s.location },
                    ]}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
