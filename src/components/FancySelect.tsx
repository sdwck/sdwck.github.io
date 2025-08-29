import { type Category } from "../types";
import { AnimatePresence, motion } from "framer-motion";

const OPTIONS: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "desktop", label: "Desktop" },
  { key: "bots", label: "Bots" },
];

export default function FancySelect({
  value,
  onChange,
}: {
  value: Category;
  onChange: (v: Category) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter projects by category"
      className="relative inline-flex items-center gap-2 p-1 rounded-2xl border border-black/10 dark:border-white/10
                 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/6 dark:to-white/8
                 isolate"
    >
      <AnimatePresence initial={false}>
        {OPTIONS.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(opt.key)}
              className={`relative isolate overflow-hidden px-3 py-1.5 rounded-xl text-sm font-semibold
                          transition-transform duration-150 cursor-pointer
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70
                          focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-transparent
                          ${selected
                            ? "text-white"
                            : "text-gray-900 dark:text-gray-100 hover:bg-black/[.06] dark:hover:bg-white/[.08]"
                          }`}
            >
              <span className={`relative z-10 ${selected ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" : ""}`}>
                {opt.label}
              </span>

              {selected && (
                <motion.span
                  layoutId="fancy-select-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="pointer-events-none absolute inset-0 -z-10 rounded-xl
                             bg-gradient-to-r from-indigo-500 to-fuchsia-500/90 shadow-lg"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
