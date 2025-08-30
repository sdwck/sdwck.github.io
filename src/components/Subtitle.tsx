import { useEffect, useState } from "react";

type SubtitleProps = {
    phrases: string[];
    className?: string;
    lineHeightRem?: number;
    containerWidth?: number;
    reserveLines?: number;
    pauseMs?: number;
    typeMs?: number;
    deleteMs?: number;
};

export function Subtitle({
    phrases,
    className = "",
    lineHeightRem = 1.6,
    reserveLines = 1,
    pauseMs = 1100,
    typeMs = 42,
    deleteMs = 18,
}: SubtitleProps) {
    const [i, setI] = useState(0);
    const [sub, setSub] = useState(0);
    const [mode, setMode] = useState<"typing" | "pausing" | "deleting">("typing");

    useEffect(() => {
        let t = 0;
        const current = phrases[i];

        if (mode === "typing") {
            if (sub < current.length) {
                t = window.setTimeout(() => setSub((n) => n + 1), typeMs);
            } else {
                setMode("pausing");
            }
        } else if (mode === "pausing") {
            t = window.setTimeout(() => setMode("deleting"), pauseMs);
        } else if (mode === "deleting") {
            if (sub > 0) {
                t = window.setTimeout(() => setSub((n) => n - 1), deleteMs);
            } else {
                setMode("typing");
                setI((n) => (n + 1) % phrases.length);
            }
        }

        return () => clearTimeout(t);
    }, [sub, mode, i, phrases, typeMs, deleteMs, pauseMs]);

    const reservedHeight = `calc(${reserveLines} * ${lineHeightRem + 0.8}rem)`;

    return (
        <div className={["mt-4", className].join(" ")}>
            <div className="relative w-full">
                <span className="pointer-events-none absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-amber-500/20 blur-lg sm:blur-xl" />
                <div
                    className={[
                        "relative rounded-xl sm:rounded-2xl",
                        "border border-black/10 dark:border-white/10",
                        "bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-sm",
                        "px-3 py-2.5 sm:px-4 sm:py-3",
                        "w-full max-w-full overflow-hidden",
                    ].join(" ")}
                    style={{
                        height: reservedHeight,
                    }}
                >
                    <div className="flex items-start h-full w-full">
                        <span
                            className={[
                                "font-mono text-sm sm:text-base lg:text-xl",
                                "whitespace-normal break-words overflow-hidden",
                                "w-full",
                            ].join(" ")}
                            style={{
                                lineHeight: `${lineHeightRem}rem`,
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                                display: "block",
                            }}>
                            <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-400"
                            >
                                {phrases[i].slice(0, sub)}
                            </span>
                            <span
                                className="inline ml-1 font-mono text-sm sm:text-base lg:text-xl select-none opacity-90 animate-pulse text-gray-400"
                                style={{ lineHeight: `${lineHeightRem}rem` }}>
                                |
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}