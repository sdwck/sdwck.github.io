import { ChevronDown } from "lucide-react";
import { type Category } from "../types";;
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const OPTIONS: { key: Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "web", label: "Web" },
    { key: "mobile", label: "Mobile" },
    { key: "desktop", label: "Desktop" },
    { key: "bots", label: "Bots" },
];

export default function MobileSelect({
    value,
    onChange
}: {
    value: Category;
    onChange: (v: Category) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = OPTIONS.find(opt => opt.key === value);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 text-sm font-medium"
                aria-label="Filter category"
            >
                <span>{selectedOption?.label || "All"}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl border border-black/10 dark:border-white/10 shadow-lg z-50"
                        >
                            {OPTIONS.map((option) => (
                                <button
                                    key={option.key}
                                    onClick={() => {
                                        onChange(option.key);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm font-medium first:rounded-t-xl last:rounded-b-xl transition-colors
                    ${value === option.key
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}