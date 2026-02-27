import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [persons, setPersons] = useState([]);
  const [dieselEntries, setDieselEntries] = useState([]);
  const [commissionLabour, setCommissionLabour] = useState([]);
  const [salesEntries, setSalesEntries] = useState([]);

  const addPerson = (person) => {
    setPersons((prev) => [...prev, { ...person, id: crypto.randomUUID() }]);
  };

  const updatePerson = (id, data) => {
    setPersons((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const removePerson = (id) => {
    setPersons((prev) => prev.filter((p) => p.id !== id));
  };

  const addDiesel = (entry) => {
    setDieselEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };

  const updateDiesel = (id, data) => {
    setDieselEntries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  const removeDiesel = (id) => {
    setDieselEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const addCommissionLabour = (entry) => {
    setCommissionLabour((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID() },
    ]);
  };

  const updateCommissionLabour = (id, data) => {
    setCommissionLabour((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const removeCommissionLabour = (id) => {
    setCommissionLabour((prev) => prev.filter((c) => c.id !== id));
  };

  const addSalesEntry = (entry) => {
    setSalesEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };

  const updateSalesEntry = (id, data) => {
    setSalesEntries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const removeSalesEntry = (id) => {
    setSalesEntries((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        persons,
        dieselEntries,
        commissionLabour,
        salesEntries,
        addPerson,
        updatePerson,
        removePerson,
        addDiesel,
        updateDiesel,
        removeDiesel,
        addCommissionLabour,
        updateCommissionLabour,
        removeCommissionLabour,
        addSalesEntry,
        updateSalesEntry,
        removeSalesEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
