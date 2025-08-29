import { Eye, EyeOff, Filter, Sparkles } from "lucide-react";
import FancySelect from "./FancySelect";
import { type Category } from "../types";
import { randomKaomoji } from "../utils/random";
import { useMemo } from "react";

export default function Header({ query, setQuery, filter, setFilter, isContentVisible, toggleContent }: any) {
    const kaomoji = useMemo(() => randomKaomoji(), []);

    return (
        <header className="w-full border-b border-black/6 dark:border-white/6 bg-white/60 dark:bg-black/30 backdrop-blur sticky top-0 z-40">
            <div className="w-full max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                <Sparkles className="opacity-70" />
                <span className="font-semibold tracking-tight">Meow {kaomoji}</span>
                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <Filter size={16} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-8 pr-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 focus:outline-none" />
                    </div>
                    <FancySelect value={filter} onChange={(v: Category) => setFilter(v)} />
                    <button onClick={toggleContent} className="ml-1 p-2 rounded-xl border border-black/10 dark:border-white/10 cursor-pointer" aria-label="Toggle content visibility">
                        {isContentVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
            </div>
        </header>
    );
}