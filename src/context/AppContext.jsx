import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [persons, setPersons] = useState([]);
  const [dieselEntries, setDieselEntries] = useState([]);
  const [commissionLabour, setCommissionLabour] = useState([]);

  const addPerson = (person) => {
    setPersons((prev) => [...prev, { ...person, id: crypto.randomUUID() }]);
  };

  const removePerson = (id) => {
    setPersons((prev) => prev.filter((p) => p.id !== id));
  };

  const addDiesel = (entry) => {
    setDieselEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };

  const removeDiesel = (id) => {
    setDieselEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const addCommissionLabour = (entry) => {
    setCommissionLabour((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };

  const removeCommissionLabour = (id) => {
    setCommissionLabour((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        persons,
        dieselEntries,
        commissionLabour,
        addPerson,
        removePerson,
        addDiesel,
        removeDiesel,
        addCommissionLabour,
        removeCommissionLabour,
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
