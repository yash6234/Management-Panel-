import Modal from '../../../components/Modal';

export default function PersonViewModal({ open, onClose, person }) {
  if (!person) return null;

  return (
    <Modal open={!!open} onClose={onClose} title="View Personal Details">
      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-slate-500">Name</dt>
          <dd className="mt-1 text-slate-800">{person.name || '—'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">M.no</dt>
          <dd className="mt-1 text-slate-800">{person.mobile || '—'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Email</dt>
          <dd className="mt-1 text-slate-800">{person.email || '—'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Address</dt>
          <dd className="mt-1 text-slate-800">{person.address || '—'}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-[#0F766E] py-2.5 font-medium text-white hover:bg-[#0d9488]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
