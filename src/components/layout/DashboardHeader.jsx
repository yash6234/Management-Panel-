import { Search } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export default function DashboardHeader() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          aria-label="Search"
        />
      </div>
    </header>
  );
}
