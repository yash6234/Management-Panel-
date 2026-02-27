import { Eye, Trash2 } from 'lucide-react';

/**
 * Shared grid-style detail card. Same formation across Dashboard, Masters, and Sales.
 */
export default function DetailCard({ title, fields, onView, onDelete }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {title && (
        <h3 className="mb-3 border-b border-slate-100 pb-2 text-base font-semibold text-slate-800">
          {title}
        </h3>
      )}
      <dl className="flex-1 space-y-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
            <dd className="mt-0.5 text-sm text-slate-800">{value || '—'}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        {onView && (
          <button
            type="button"
            onClick={onView}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Shared grid container class for detail cards across all pages */
export const detailGridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
