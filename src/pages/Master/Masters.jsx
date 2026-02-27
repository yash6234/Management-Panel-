import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserPlus, Fuel, Briefcase, Pencil, Trash2, Eye } from 'lucide-react';
import PersonModal from './person/PersonModal';
import PersonViewModal from './person/PersonViewModal';
import VehicleModal from './vehicle/VehicleModal';
import CommissionLabourModal from './commission/CommissionLabourModal';

export default function Masters() {
  const {
    persons = [],
    personsLoading,
    personsError,
    dieselEntries = [],
    commissionLabour = [],
    addPerson,
    updatePerson,
    removePerson,
    addDiesel,
    updateDiesel,
    removeDiesel,
    addCommissionLabour,
    updateCommissionLabour,
    removeCommissionLabour,
  } = useOutletContext();
  const [activeTab, setActiveTab] = useState('person');
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [dieselModalOpen, setDieselModalOpen] = useState(false);
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingDiesel, setEditingDiesel] = useState(null);
  const [editingCommission, setEditingCommission] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [personSaveError, setPersonSaveError] = useState(null);

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

  const handleAddPerson = () => {
    setEditingPerson(null);
    setPersonModalOpen(true);
  };
  const handleEditPerson = (p) => {
    setEditingPerson(p);
    setPersonModalOpen(true);
  };

  const handleSavePerson = async (data) => {
    setPersonSaveError(null);
    try {
      const id = editingPerson?.id || editingPerson?._id;
      if (editingPerson) await updatePerson(id, data);
      else await addPerson(data);
      setPersonModalOpen(false);
      setEditingPerson(null);
    } catch (err) {
      setPersonSaveError(err.response?.data?.message || err.message || 'Failed to save');
    }
  };

  const handleAddDiesel = () => {
    setEditingDiesel(null);
    setDieselModalOpen(true);
  };
  const handleEditDiesel = (d) => {
    setEditingDiesel(d);
    setDieselModalOpen(true);
  };
  const handleSaveDiesel = (data) => {
    if (editingDiesel) updateDiesel(editingDiesel.id, data);
    else addDiesel(data);
    setDieselModalOpen(false);
    setEditingDiesel(null);
  };

  const handleAddCommission = () => {
    setEditingCommission(null);
    setCommissionModalOpen(true);
  };
  const handleEditCommission = (c) => {
    setEditingCommission(c);
    setCommissionModalOpen(true);
  };
  const handleSaveCommission = (data) => {
    if (editingCommission) updateCommissionLabour(editingCommission.id, data);
    else addCommissionLabour(data);
    setCommissionModalOpen(false);
    setEditingCommission(null);
  };

  const handleDeletePerson = async (p) => {
    if (window.confirm(`Delete "${p.name}"?`)) {
      try {
        await removePerson(p.id || p._id);
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete');
      }
    }
  };
  const handleDeleteDiesel = (d) => {
    if (window.confirm(`Delete "${d.name}"?`)) removeDiesel(d.id);
  };
  const handleDeleteCommission = (c) => {
    if (window.confirm(`Delete "${c.name}"?`)) removeCommissionLabour(c.id);
  };

  const tabClass = (tab) =>
    `flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'border-[#0F766E] bg-white text-[#0F766E]'
        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
    }`;

  const btnClass =
    'inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d9488]';
  const iconBtnClass = (color) =>
    `inline-flex rounded-lg p-2 transition-colors hover:opacity-80 ${color === 'red' ? 'text-red-600 hover:bg-red-50' : 'text-[#0F766E] hover:bg-teal-50'}`;

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
            <button type="button" className={tabClass('person')} onClick={() => setActiveTab('person')}>
              <UserPlus className="h-4 w-4" />
              Personal Details
            </button>
            <button type="button" className={tabClass('diesel')} onClick={() => setActiveTab('diesel')}>
              <Fuel className="h-4 w-4" />
              Vehicle
            </button>
            <button type="button" className={tabClass('commission')} onClick={() => setActiveTab('commission')}>
              <Briefcase className="h-4 w-4" />
              Commission/Labour
            </button>
          </div>
        </div>

        <div className="p-6 pt-4">
          {activeTab === 'person' && (
            <>
              <div className="mb-4 flex justify-end">
                <button type="button" className={btnClass} onClick={handleAddPerson}>
                  <UserPlus className="h-4 w-4" />
                  Add Person
                </button>
              </div>
              {personsError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {personsError}
                </div>
              )}
              {personSaveError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {personSaveError}
                </div>
              )}
              {personsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0F766E] border-t-transparent" />
                </div>
              ) : filteredPersons.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No persons yet. Click Add Person to create one.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">M.no</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Address</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPersons.map((p) => (
                        <tr key={p.id || p._id} className="border-b border-[#E5E7EB] hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                          <td className="px-4 py-3 text-slate-700">{p.mobile || '—'}</td>
                          <td className="px-4 py-3 text-slate-700">{p.email || '—'}</td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-slate-700">{p.address || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button type="button" className={iconBtnClass()} onClick={() => setViewingPerson(p)} title="View">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button type="button" className={iconBtnClass()} onClick={() => handleEditPerson(p)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button type="button" className={iconBtnClass('red')} onClick={() => handleDeletePerson(p)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'diesel' && (
            <>
              <div className="mb-4 flex justify-end">
                <button type="button" className={btnClass} onClick={handleAddDiesel}>
                  <Fuel className="h-4 w-4" />
                  Add Vehicle
                </button>
              </div>
              {filteredDiesel.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No vehicle entries yet. Click Add Vehicle to create one.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDiesel.map((d) => (
                        <tr key={d.id} className="border-b border-[#E5E7EB] hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">{d.name}</td>
                          <td className="px-4 py-3 text-slate-700">{d.amount ?? '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button type="button" className={iconBtnClass()} onClick={() => handleEditDiesel(d)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button type="button" className={iconBtnClass('red')} onClick={() => handleDeleteDiesel(d)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'commission' && (
            <>
              <div className="mb-4 flex justify-end">
                <button type="button" className={btnClass} onClick={handleAddCommission}>
                  <Briefcase className="h-4 w-4" />
                  Add Commission/Labour
                </button>
              </div>
              {filteredCommission.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No commission/labour entries yet. Click Add to create one.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommission.map((c) => (
                        <tr key={c.id} className="border-b border-[#E5E7EB] hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                          <td className="px-4 py-3 text-slate-700">{c.amount ?? '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button type="button" className={iconBtnClass()} onClick={() => handleEditCommission(c)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button type="button" className={iconBtnClass('red')} onClick={() => handleDeleteCommission(c)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PersonViewModal open={!!viewingPerson} onClose={() => setViewingPerson(null)} person={viewingPerson} />

      <PersonModal
        open={personModalOpen}
        onClose={() => { setPersonModalOpen(false); setEditingPerson(null); }}
        onSave={handleSavePerson}
        editing={editingPerson}
      />
      <VehicleModal
        open={dieselModalOpen}
        onClose={() => { setDieselModalOpen(false); setEditingDiesel(null); }}
        onSave={handleSaveDiesel}
        editing={editingDiesel}
      />
      <CommissionLabourModal
        open={commissionModalOpen}
        onClose={() => { setCommissionModalOpen(false); setEditingCommission(null); }}
        onSave={handleSaveCommission}
        editing={editingCommission}
      />
    </div>
  );
}
