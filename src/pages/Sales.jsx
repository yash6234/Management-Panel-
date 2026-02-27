import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import PersonViewModal from '../components/sales/PersonViewModal';
import DetailCard, { detailGridClass } from '../components/ui/DetailCard';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const eventStyleGetter = () => ({
  style: {
    backgroundColor: '#4f46e5',
    borderRadius: '6px',
    opacity: 0.9,
  },
});

export default function Sales() {
  const { persons, removePerson } = useApp();
  const { searchQuery } = useSearch();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [viewingPerson, setViewingPerson] = useState(null);

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

  const events = useMemo(() => [], []);

  const handleDelete = (person) => {
    if (window.confirm(`Delete "${person.name}" from personal details?`)) {
      removePerson(person.id);
    }
  };

  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
        <p className="mt-1 text-slate-600">
          Personal details and full-screen calendar.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Users className="h-5 w-5" />
          Added Personal Details
        </h2>
        {persons.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            No persons added yet. Add persons from the Masters page.
          </div>
        ) : (
          <div className={detailGridClass}>
            {filteredPersons.map((p) => (
              <DetailCard
                key={p.id}
                title={p.name}
                fields={[
                  { label: 'M.no', value: p.mobile },
                  { label: 'Email', value: p.email },
                  { label: 'Address', value: p.address },
                ]}
                onView={() => setViewingPerson(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>
        )}
      </div>

      <PersonViewModal
        open={!!viewingPerson}
        onClose={() => setViewingPerson(null)}
        person={viewingPerson}
      />

      <div className="flex-1 min-h-[500px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <CalendarIcon className="h-5 w-5" />
          Calendar
        </h2>
        <div className="h-[calc(100%-3rem)] min-h-[400px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            className="rbc-calendar-full"
          />
        </div>
      </div>
    </div>
  );
}
