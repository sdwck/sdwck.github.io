import { useMemo, useState } from "react";
import { randomQuote } from "../utils/random";

export default function Footer() {
    const quote = useMemo(randomQuote, []);
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    return (
        <footer className="w-full border-t border-white/10 py-8 sm:py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm opacity-70 text-center sm:text-left">
                {new Date().getFullYear()} ©{" "}
                <a
                    href="https://github.com/sdwck"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity duration-200 underline underline-offset-3">
                    sdwck
                </a>
                . <span onMouseEnter={() => setIsMouseEntered(true)}>{isMouseEntered ? 'All rights reserved.' : quote}</span>
            </div>
        </footer>
    );
}