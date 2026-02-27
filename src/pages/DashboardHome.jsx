import { Card, Table, Badge } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Users, Fuel, Briefcase, ShoppingCart, TrendingUp, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import { format } from 'date-fns';
import 'dayjs/locale/en';

const stats = [
  { id: 'persons', label: 'Persons', icon: Users, color: 'teal' },
  { id: 'diesel', label: 'Vehicle Entries', icon: Fuel, color: 'cyan' },
  { id: 'commission', label: 'Commission/Labour', icon: Briefcase, color: 'teal' },
  { id: 'sales', label: 'Sales Entries', icon: ShoppingCart, color: 'cyan' },
];

export default function DashboardHome() {
  const { persons, dieselEntries, commissionLabour, salesEntries } = useApp();
  const { searchQuery } = useSearch();

  const matchesSearch = (text, query) => {
    if (!query.trim()) return true;
    return String(text).toLowerCase().includes(query.trim().toLowerCase());
  };

  const filteredCards = searchQuery.trim()
    ? stats.filter(
      (c) =>
        matchesSearch(c.label, searchQuery) ||
        matchesSearch(c.id, searchQuery)
    )
    : stats;

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview of all management panel sections and quick stats.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredCards.map(({ id, label, icon: Icon }) => (
          <Card
            key={id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="border border-[#E5E7EB] bg-white transition-all hover:shadow-md"
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
          </Card>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          className="col-span-1 lg:col-span-2 border border-[#E5E7EB] bg-white"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0F766E]" />
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No sales activity yet. Add entries from the Sales page.
            </p>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Products</Table.Th>
                  <Table.Th>Deposit</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentActivity.map((entry) => (
                  <Table.Tr key={entry.id}>
                    <Table.Td className="font-medium">{entry.name || '—'}</Table.Td>
                    <Table.Td>
                      {entry.date ? format(new Date(entry.date), 'MMM d, yyyy') : '—'}
                    </Table.Td>
                    <Table.Td>{entry.salesOfProducts || '—'}</Table.Td>
                    <Table.Td>
                      <Badge color="teal" variant="light">
                        {entry.deposit || '—'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        {/* <Card
          shadow="sm"
          padding="lg"
          radius="md"
          className="border border-[#E5E7EB] bg-white"
        > */}
        {/* <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#0F766E]" />
            <h2 className="text-lg font-semibold text-slate-800">Calendar</h2>
          </div>
          <Calendar
            size="sm"
            styles={{
              day: { borderRadius: '8px' },
              selected: { backgroundColor: '#0F766E' },
            }}
          /> */}
        {/* </Card> */}
      </div>
    </div>
  );
}
