import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';



const inputClass =
  'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20';

export default function PersonModal({ open, onClose, onSave, editing }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', mobile: '', email: '', address: '' },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      reset(
        editing
          ? {
              name: editing.name,
              mobile: editing.mobile || '',
              email: editing.email || '',
              address: editing.address || '',
            }
          : { name: '', mobile: '', email: '', address: '' }
      );
    }
  }, [open, editing, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.name?.trim()) {
      setError('name', { message: 'Name is required' });
      return;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('email', { message: 'Invalid email' });
      return;
    }
    onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal open={!!open} onClose={onClose} title={editing ? 'Edit Person' : 'Add Person'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            placeholder="Full name"
            className={inputClass}
            {...register('name')}
          />
          {errors.name?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">M.no</label>
          <input
            type="text"
            placeholder="Mobile number"
            className={inputClass}
            {...register('mobile')}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="Email address"
            className={inputClass}
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
          <textarea
            placeholder="Address"
            rows={3}
            className={inputClass}
            {...register('address')}
          />
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
