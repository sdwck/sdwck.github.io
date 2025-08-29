import { useMemo } from "react";
import { randomQuote } from "../utils/random";

export default function Footer() {
    const quote = useMemo(randomQuote, []);
    return (
        <footer className="w-full border-t border-black/10 dark:border-white/10 py-10">
            <div className="w-full max-w-6xl mx-auto px-4 text-sm opacity-70">{new Date().getFullYear()} © sdwck. {quote}</div>
        </footer>
    );
}