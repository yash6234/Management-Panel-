import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { startOfDay, addHours } from 'date-fns';
import { Select } from '@mantine/core';
import { useApp } from '../context/AppContext';
import SalesEntryModal from '../components/sales/SalesEntryModal';

export default function Sales() {
  const { persons, salesEntries, addSalesEntry } = useApp();
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);

  const personOptions = [
    { value: '', label: 'All persons' },
    ...persons.map((p) => ({ value: p.id, label: p.name })),
  ];

  const filteredSalesEntries = useMemo(() => {
    if (!selectedPersonId) return salesEntries;
    return salesEntries.filter(
      (e) =>
        e.personId === selectedPersonId ||
        e.name === persons.find((p) => p.id === selectedPersonId)?.name
    );
  }, [salesEntries, selectedPersonId, persons]);

  const events = useMemo(() => {
    return filteredSalesEntries.map((entry) => {
      const start = startOfDay(new Date(entry.date));
      const end = addHours(start, 1);
      const title = entry.name
        ? `${entry.name} – ${entry.salesOfProducts}`
        : entry.salesOfProducts;
      return {
        id: entry.id,
        title,
        start,
        end,
      };
    });
  }, [filteredSalesEntries]);

  const handleSelectSlot = (info) => {
    setSelectedSlotDate(info.date);
    setSalesModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-6 py-4">
        {/* <div>
          <h1 className="text-xl font-bold text-slate-800">Sales Calendar</h1>
          <p className="text-sm text-slate-600">
            Click a date to add a sales entry. View all data in the Data page.
          </p>
        </div> */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0F766E]" />
          <Select
            placeholder="All persons"
            data={personOptions}
            value={selectedPersonId}
            onChange={setSelectedPersonId}
            clearable
            searchable
            className="min-w-[180px]"
            styles={{ input: { borderRadius: '8px' } }}
          />
        </div>
      </div>

      <SalesEntryModal
        open={salesModalOpen}
        onClose={() => {
          setSalesModalOpen(false);
          setSelectedSlotDate(null);
        }}
        onSave={addSalesEntry}
        selectedDate={selectedSlotDate}
      />

      <div className="flex-1 min-h-0 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          selectable
          selectMirror
          dateClick={handleSelectSlot}
          select={handleSelectSlot}
          eventDisplay="block"
          height="100%"
        />
      </div>
    </div>
  );
}
