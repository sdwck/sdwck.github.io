import { DatabaseZap, Eye, EyeOff, Filter } from 'lucide-react';
import FancySelect from './FancySelect';
import MobileSelect from './MobileSelect';
import type { Category } from '../types';

interface HeaderProps {
  query: string;
  setQuery: (value: string) => void;
  filter: Category;
  setFilter: (value: Category) => void;
  isContentVisible: boolean;
  toggleContent: () => void;
}

export default function Header({
  query,
  setQuery,
  filter,
  setFilter,
  isContentVisible,
  toggleContent
}: HeaderProps) {
  return (
    <header className="w-full border-b border-white/6 bg-black/30 backdrop-blur sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex lg:hidden items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
              <DatabaseZap className="h-5 w-5 text-violet-300" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-white">
                Vladislav B.
              </span>

              <span className="text-xs text-white/45">
                Backend Engineer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <MobileSelect value={filter} onChange={setFilter} />
            <button
              onClick={toggleContent}
              className="p-2 rounded-xl border border-white/10 cursor-pointer">
              {isContentVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <div className="flex lg:hidden mt-3">
          <div className="relative w-full">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/8 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
            <DatabaseZap className="h-5 w-5 text-violet-300" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-white">
              Vladislav B.
            </span>

            <span className="text-xs text-white/45">
              Backend Engineer
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="pl-9 pr-4 py-2 rounded-xl bg-white/8 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 min-w-64"
              />
            </div>

            <FancySelect value={filter} onChange={setFilter} />

            <button
              onClick={toggleContent}
              className="p-2 rounded-xl border border-white/10 cursor-pointer">
              {isContentVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}