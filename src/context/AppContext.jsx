import { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchSalesMen,
  addSalesMan,
  editSalesMan,
  deleteSalesMan,
} from '../api/salesMan.js';
import { getToken } from '../api/auth.js';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [persons, setPersons] = useState([]);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [personsError, setPersonsError] = useState(null);
  const [dieselEntries, setDieselEntries] = useState([]);
  const [commissionLabour, setCommissionLabour] = useState([]);
  const [salesEntries, setSalesEntries] = useState([]);

  const loadPersons = async () => {
    setPersonsLoading(true);
    setPersonsError(null);
    try {
      const data = await fetchSalesMen();
      setPersons(Array.isArray(data) ? data : []);
    } catch (err) {
      setPersonsError(err.response?.data?.message || err.message || 'Failed to fetch persons');
      setPersons([]);
    } finally {
      setPersonsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPersons();
    } else {
      setPersons([]);
      setPersonsError(null);
    }
  }, [isAuthenticated]);

  const addPerson = async (person) => {
    const result = await addSalesMan(person);
    if (Array.isArray(result) && result.length > 0) {
      setPersons((prev) => {
        const exists = prev.some((p) => (p.id || p._id) === (result[0].id || result[0]._id));
        if (exists) return prev.map((p) => (p.id === result[0].id ? result[0] : p));
        return [...prev, result[0]];
      });
    } else {
      await loadPersons();
    }
  };

  const updatePerson = async (id, data) => {
    await editSalesMan(id, data);
    setPersons((prev) =>
      prev.map((p) => ((p.id || p._id) === id ? { ...p, ...data } : p))
    );
  };

  const removePerson = async (id) => {
    await deleteSalesMan(id);
    setPersons((prev) => prev.filter((p) => (p.id || p._id) !== id));
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
        personsLoading,
        personsError,
        loadPersons,
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
