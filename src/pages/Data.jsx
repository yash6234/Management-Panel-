import { useState } from 'react';
import { Tabs, Card } from '@mantine/core';
import { Users, Fuel, Briefcase, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import { format } from 'date-fns';
import DetailCard, { dataGridClass } from '../components/ui/DetailCard';

export default function Data() {
  const [activeTab, setActiveTab] = useState('persons');
  const { persons, dieselEntries, commissionLabour, salesEntries } = useApp();
  const { searchQuery } = useSearch();

  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return String(text).toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  const filteredPersons = persons.filter(
    (p) =>
      matchesSearch(p.name) ||
      matchesSearch(p.mobile) ||
      matchesSearch(p.email) ||
      matchesSearch(p.address)
  );
  const filteredDiesel = dieselEntries.filter(
    (d) => matchesSearch(d.name) || matchesSearch(String(d.amount))
  );
  const filteredCommission = commissionLabour.filter(
    (c) => matchesSearch(c.name) || matchesSearch(String(c.amount))
  );
  const filteredSales = salesEntries.filter(
    (s) =>
      matchesSearch(s.name) ||
      matchesSearch(s.salesOfProducts) ||
      matchesSearch(s.deposit) ||
      matchesSearch(s.location)
  );

  return (
    <div className="p-6 lg:p-8">
      {/* <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">All Data</h1>
        <p className="mt-1 text-slate-600">
          View all persons, vehicle, commission/labour, and sales entries in one place.
        </p>
      </div> */}

      <Card shadow="sm" padding="lg" radius="md" className="border border-[#E5E7EB] bg-white">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="persons" leftSection={<Users className="h-4 w-4" />}>
              Personal Details ({persons.length})
            </Tabs.Tab>
            <Tabs.Tab value="diesel" leftSection={<Fuel className="h-4 w-4" />}>
              Vehicle ({dieselEntries.length})
            </Tabs.Tab>
            <Tabs.Tab value="commission" leftSection={<Briefcase className="h-4 w-4" />}>
              Commission/Labour ({commissionLabour.length})
            </Tabs.Tab>
            <Tabs.Tab value="sales" leftSection={<ShoppingCart className="h-4 w-4" />}>
              Sales ({salesEntries.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="persons" pt="md">
            {filteredPersons.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No persons added yet.</p>
            ) : (
              <div className={dataGridClass}>
                {filteredPersons.map((p) => (
                  <DetailCard
                    key={p.id}
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
            )}
          </Tabs.Panel>

          <Tabs.Panel value="diesel" pt="md">
            {filteredDiesel.length === 0 ? (
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
            )}
          </Tabs.Panel>

          <Tabs.Panel value="commission" pt="md">
            {filteredCommission.length === 0 ? (
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
            )}
          </Tabs.Panel>

          <Tabs.Panel value="sales" pt="md">
            {filteredSales.length === 0 ? (
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
            )}
          </Tabs.Panel>
        </Tabs>
      </Card>
    </div>
  );
}
