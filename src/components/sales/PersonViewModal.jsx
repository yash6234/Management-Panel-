import { Modal, Button } from '@mantine/core';

export default function PersonViewModal({ open, onClose, person }) {
  if (!person) return null;

  return (
    <Modal
      opened={!!open}
      onClose={onClose}
      title="View Personal Details"
      centered
      radius="md"
      styles={{
        header: { borderBottom: '1px solid #E5E7EB' },
        content: { maxWidth: 420 },
      }}
    >
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
        <Button fullWidth color="teal" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
