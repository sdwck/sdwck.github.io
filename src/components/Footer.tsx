import { useMemo } from "react";
import { randomQuote } from "../utils/random";

export default function Footer() {
    const quote = useMemo(randomQuote, []);
    return (
        <footer className="w-full border-t border-black/10 dark:border-white/10 py-8 sm:py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm opacity-70 text-center sm:text-left">
                {new Date().getFullYear()} © sdwck. {quote}
            </div>
        </footer>
    );
}