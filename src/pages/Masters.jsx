import { useState } from 'react';
import { UserPlus, Fuel, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import PersonModal from '../components/masters/PersonModal';
import DieselModal from '../components/masters/DieselModal';
import CommissionLabourModal from '../components/masters/CommissionLabourModal';
import PersonViewModal from '../components/sales/PersonViewModal';
import Modal from '../components/ui/Modal';
import DetailCard, { detailGridClass } from '../components/ui/DetailCard';

const masterCards = [
  { id: 'person', title: 'Person', icon: UserPlus },
  { id: 'diesel', title: 'Diesel', icon: Fuel },
  { id: 'commission', title: 'Commission / Labour', icon: Briefcase },
];

export default function Masters() {
  const [openModal, setOpenModal] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);
  const [viewingDiesel, setViewingDiesel] = useState(null);
  const [viewingCommission, setViewingCommission] = useState(null);
  const { addPerson, addDiesel, addCommissionLabour, removePerson, removeDiesel, removeCommissionLabour, persons, dieselEntries, commissionLabour } = useApp();
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

  const handleDeletePerson = (p) => {
    if (window.confirm(`Delete "${p.name}"?`)) removePerson(p.id);
  };
  const handleDeleteDiesel = (d) => {
    if (window.confirm(`Delete "${d.name}"?`)) removeDiesel(d.id);
  };
  const handleDeleteCommission = (c) => {
    if (window.confirm(`Delete "${c.name}"?`)) removeCommissionLabour(c.id);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Masters</h1>
        <p className="mt-1 text-slate-600">
          Manage Person, Diesel, and Commission/Labour data. Click a card to open the form.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {masterCards.map(({ id, title, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpenModal(id)}
            className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
              <Icon className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="truncate text-sm font-semibold text-slate-800">{title}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {persons.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Persons</h2>
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
                  onDelete={() => handleDeletePerson(p)}
                />
              ))}
            </div>
          </section>
        )}
        {dieselEntries.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Diesel</h2>
            <div className={detailGridClass}>
              {filteredDiesel.map((d) => (
                <DetailCard
                  key={d.id}
                  title={d.name}
                  fields={[{ label: 'Amount', value: String(d.amount) }]}
                  onView={() => setViewingDiesel(d)}
                  onDelete={() => handleDeleteDiesel(d)}
                />
              ))}
            </div>
          </section>
        )}
        {commissionLabour.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Commission / Labour</h2>
            <div className={detailGridClass}>
              {filteredCommission.map((c) => (
                <DetailCard
                  key={c.id}
                  title={c.name}
                  fields={[{ label: 'Amount', value: String(c.amount) }]}
                  onView={() => setViewingCommission(c)}
                  onDelete={() => handleDeleteCommission(c)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <PersonViewModal open={!!viewingPerson} onClose={() => setViewingPerson(null)} person={viewingPerson} />

      <Modal open={!!viewingDiesel} onClose={() => setViewingDiesel(null)} title="View Diesel">
        {viewingDiesel && (
          <>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-slate-800">{viewingDiesel.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Amount</dt>
                <dd className="mt-1 text-slate-800">{viewingDiesel.amount ?? '—'}</dd>
              </div>
            </dl>
            <button type="button" onClick={() => setViewingDiesel(null)} className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500">Close</button>
          </>
        )}
      </Modal>

      <Modal open={!!viewingCommission} onClose={() => setViewingCommission(null)} title="View Commission / Labour">
        {viewingCommission && (
          <>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-slate-800">{viewingCommission.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Amount</dt>
                <dd className="mt-1 text-slate-800">{viewingCommission.amount ?? '—'}</dd>
              </div>
            </dl>
            <button type="button" onClick={() => setViewingCommission(null)} className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500">Close</button>
          </>
        )}
      </Modal>

      <PersonModal
        open={openModal === 'person'}
        onClose={() => setOpenModal(null)}
        onSave={addPerson}
      />
      <DieselModal
        open={openModal === 'diesel'}
        onClose={() => setOpenModal(null)}
        onSave={addDiesel}
      />
      <CommissionLabourModal
        open={openModal === 'commission'}
        onClose={() => setOpenModal(null)}
        onSave={addCommissionLabour}
      />
    </div>
  );
}
