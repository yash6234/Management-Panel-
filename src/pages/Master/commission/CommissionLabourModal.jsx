import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';

const inputClass =
  'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20';

export default function CommissionLabourModal({ open, onClose, onSave, editing }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', amount: 0 },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      reset(editing ? { name: editing.name, amount: editing.amount ?? 0 } : { name: '', amount: 0 });
    }
  }, [open, editing, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.name?.trim()) {
      setError('name', { message: 'Name is required' });
      return;
    }
    const amount = Number(data.amount);
    if (isNaN(amount) || amount < 0) {
      setError('amount', { message: 'Enter a valid amount' });
      return;
    }
    onSave({ name: data.name.trim(), amount });
    reset();
    onClose();
  };

  return (
    <Modal open={!!open} onClose={onClose} title={editing ? 'Edit Commission/Labour' : 'Add Commission/Labour'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            {...register('name')}
          />
          {errors.name?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            placeholder="Amount"
            min={0}
            step={0.01}
            className={inputClass}
            {...register('amount')}
          />
          {errors.amount?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
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
