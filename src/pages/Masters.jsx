import { useState } from 'react';
import { Tabs, Card, Table, Button, ActionIcon, Loader, Alert } from '@mantine/core';
import { UserPlus, Fuel, Briefcase, Pencil, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import PersonModal from '../components/masters/PersonModal';
import DieselModal from '../components/masters/DieselModal';
import CommissionLabourModal from '../components/masters/CommissionLabourModal';
import PersonViewModal from '../components/sales/PersonViewModal';

export default function Masters() {
  const [activeTab, setActiveTab] = useState('person');
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [dieselModalOpen, setDieselModalOpen] = useState(false);
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingDiesel, setEditingDiesel] = useState(null);
  const [editingCommission, setEditingCommission] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);

  const {
    persons,
    personsLoading,
    personsError,
    dieselEntries,
    commissionLabour,
    addPerson,
    updatePerson,
    removePerson,
    addDiesel,
    updateDiesel,
    removeDiesel,
    addCommissionLabour,
    updateCommissionLabour,
    removeCommissionLabour,
  } = useApp();
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

  const handleAddPerson = () => {
    setEditingPerson(null);
    setPersonModalOpen(true);
  };
  const handleEditPerson = (p) => {
    setEditingPerson(p);
    setPersonModalOpen(true);
  };
  const [personSaveError, setPersonSaveError] = useState(null);

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

  return (
    <div className="p-6 lg:p-8">
      {/* //   <div className="mb-8">
    //     <h1 className="text-2xl font-bold text-slate-800">Masters</h1>
    //     <p className="mt-1 text-slate-600">
    //       Manage Person, Vehicle, and Commission/Labour data. Use tabs to switch between tables.
    //     </p>
    //   </div> */}

      <Card shadow="sm" padding="lg" radius="md" className="border border-[#E5E7EB] bg-white">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="person" leftSection={<UserPlus className="h-4 w-4" />}>
              Personal Details
            </Tabs.Tab>
            <Tabs.Tab value="diesel" leftSection={<Fuel className="h-4 w-4" />}>
              Vehicle
            </Tabs.Tab>
            <Tabs.Tab value="commission" leftSection={<Briefcase className="h-4 w-4" />}>
              Commission/Labour
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="person" pt="md">
            <div className="mb-4 flex justify-end">
              <Button leftSection={<UserPlus className="h-4 w-4" />} color="teal" onClick={handleAddPerson}>
                Add Person
              </Button>
            </div>
            {personsError && <Alert color="red" mb="md">{personsError}</Alert>}
            {personSaveError && <Alert color="red" mb="md">{personSaveError}</Alert>}
            {personsLoading ? (
              <div className="flex justify-center py-8">
                <Loader color="teal" />
              </div>
            ) : filteredPersons.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No persons yet. Click Add Person to create one.</p>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>M.no</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPersons.map((p) => (
                    <Table.Tr key={p.id || p._id}>
                      <Table.Td className="font-medium">{p.name}</Table.Td>
                      <Table.Td>{p.mobile || '—'}</Table.Td>
                      <Table.Td>{p.email || '—'}</Table.Td>
                      <Table.Td className="max-w-[200px] truncate">{p.address || '—'}</Table.Td>
                      <Table.Td>
                        <div className="flex gap-1">
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={() => setViewingPerson(p)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={() => handleEditPerson(p)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeletePerson(p)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionIcon>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="diesel" pt="md">
            <div className="mb-4 flex justify-end">
              <Button leftSection={<Fuel className="h-4 w-4" />} color="teal" onClick={handleAddDiesel}>
                Add Vehicle
              </Button>
            </div>
            {filteredDiesel.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No vehicle entries yet. Click Add Vehicle to create one.</p>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredDiesel.map((d) => (
                    <Table.Tr key={d.id}>
                      <Table.Td className="font-medium">{d.name}</Table.Td>
                      <Table.Td>{d.amount ?? '—'}</Table.Td>
                      <Table.Td>
                        <div className="flex gap-1">
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={() => handleEditDiesel(d)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteDiesel(d)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionIcon>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="commission" pt="md">
            <div className="mb-4 flex justify-end">
              <Button leftSection={<Briefcase className="h-4 w-4" />} color="teal" onClick={handleAddCommission}>
                Add Commission/Labour
              </Button>
            </div>
            {filteredCommission.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No commission/labour entries yet. Click Add to create one.</p>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredCommission.map((c) => (
                    <Table.Tr key={c.id}>
                      <Table.Td className="font-medium">{c.name}</Table.Td>
                      <Table.Td>{c.amount ?? '—'}</Table.Td>
                      <Table.Td>
                        <div className="flex gap-1">
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={() => handleEditCommission(c)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteCommission(c)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionIcon>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>
        </Tabs>
      </Card>

      <PersonViewModal open={!!viewingPerson} onClose={() => setViewingPerson(null)} person={viewingPerson} />

      <PersonModal
        open={personModalOpen}
        onClose={() => { setPersonModalOpen(false); setEditingPerson(null); }}
        onSave={handleSavePerson}
        editing={editingPerson}
      />
      <DieselModal
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
    </div >
  );
}
