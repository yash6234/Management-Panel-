import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import Modal from '../../components/Modal';

function toDateOnly(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, 'yyyy-MM-dd');
}

const inputClass =
  'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20';

export default function SalesEntryModal({ open, onClose, onSave, selectedDate, persons = [] }) {
  const personOptions = [
    { value: '', label: '— Select person (optional) —' },
    ...persons.map((p) => ({ value: p.id || p._id, label: p.name || p.id || p._id })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      date: toDateOnly(new Date()),
      salesOfProducts: '',
      deposit: '',
      credit: '',
      location: '',
    },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      const dateStr = selectedDate ? toDateOnly(selectedDate) : toDateOnly(new Date());
      reset({
        name: '',
        date: dateStr,
        salesOfProducts: '',
        deposit: '',
        credit: '',
        location: '',
      });
    }
  }, [open, selectedDate, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.date?.trim()) {
      setError('date', { message: 'Date is required' });
      return;
    }
    if (!data.salesOfProducts?.trim()) {
      setError('salesOfProducts', { message: 'Sales of Products is required' });
      return;
    }
    if (!data.deposit?.trim()) {
      setError('deposit', { message: 'Deposit is required' });
      return;
    }
    const person = persons.find((p) => (p.id || p._id) === data.name);
    onSave({
      name: person?.name ?? data.name ?? '',
      personId: data.name || null,
      date: data.date,
      salesOfProducts: data.salesOfProducts.trim(),
      deposit: data.deposit.trim(),
      credit: (data.credit || '').trim(),
      location: (data.location || '').trim(),
    });
    reset();
    onClose();
  };

  return (
    <Modal open={!!open} onClose={onClose} title="Add Sales Entry">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Person</label>
          <select
            className={inputClass}
            {...register('name')}
          >
            {personOptions.map((opt) => (
              <option key={opt.value || 'empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
          <input type="date" required className={inputClass} {...register('date')} />
          {errors.date?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sales of Products</label>
          <input
            type="text"
            placeholder="Sales of products"
            className={inputClass}
            {...register('salesOfProducts')}
          />
          {errors.salesOfProducts?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.salesOfProducts.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Deposit</label>
          <input
            type="text"
            placeholder="Deposit"
            className={inputClass}
            {...register('deposit')}
          />
          {errors.deposit?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.deposit.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Credit</label>
          <input type="text" placeholder="Credit" className={inputClass} {...register('credit')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <input type="text" placeholder="Location" className={inputClass} {...register('location')} />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#0F766E] px-4 py-2.5 font-medium text-white hover:bg-[#0d9488]"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
