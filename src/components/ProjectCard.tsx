import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Images, Github } from "lucide-react";
import { Badge } from "./Badge";
import { LinkButton } from "./LinkButton";
import type { Project } from "../types";

const interactiveAnim = {
    whileHover: { scale: 1.03, opacity: 1 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15 },
};

export function ProjectCard({
    p,
    onOpenLightbox,
    onBadgeClick,
}: {
    p: Project;
    onOpenLightbox: (images: string[], index?: number) => void;
    onBadgeClick?: (stack: string) => void;
}) {
    const items = [...(p.category ?? []), ...(p.stack ?? [])];

    const containerRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
    const measureBadgeRefs = useRef<Array<HTMLDivElement | null>>([]);
    const measureEllipsisRef = useRef<HTMLDivElement | null>(null);
    const [visibleCount, setVisibleCount] = useState(items.length);
    const [showHidden, setShowHidden] = useState(false);

    useLayoutEffect(() => {
        if (!containerRef.current || !measureRef.current) return;

        let resizeObserver: ResizeObserver | null = null;

        const measure = () => {
            const container = containerRef.current!;
            const containerWidth = container.clientWidth;
            const widths = items.map((_, i) => measureBadgeRefs.current[i]?.offsetWidth ?? 0);
            const style = getComputedStyle(container);
            const gapPx = parseFloat(style.gap || style.columnGap || "8") || 8;
            const ellWidth = measureEllipsisRef.current?.offsetWidth ?? (widths.length ? widths[0] : 24);
            const totalWidths = widths.reduce((a, b) => a + b, 0) + gapPx * Math.max(0, widths.length - 1);
            if (totalWidths <= containerWidth) {
                setVisibleCount(items.length);
                return;
            }

            let acc = 0;
            let count = 0;
            for (let i = 0; i < widths.length; i++) {
                const nextAcc = acc + widths[i] + (count > 0 ? gapPx : 0);
                const spaceNeeded = nextAcc + (count > 0 ? gapPx : 0) + ellWidth;
                if (spaceNeeded <= containerWidth) {
                    acc = nextAcc;
                    count++;
                } else {
                    break;
                }
            }

            setVisibleCount(Math.max(0, count));
        };

        measure();
        resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(containerRef.current);
        resizeObserver.observe(measureRef.current);

        window.addEventListener("resize", measure);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", measure);
            resizeObserver = null;
        };
    }, [items]);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (containerRef.current.contains(e.target as Node)) return;
            setShowHidden(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const hiddenCount = Math.max(0, items.length - visibleCount);
    const hiddenItems = items.slice(visibleCount);

    return (
        <motion.div
            layout
            className="group relative bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
        >
            <div className="aspect-video w-full overflow-hidden">
                <img
                    src={p.screenshots?.find((url) => url.includes("cover.")) ?? p.screenshots?.[0]}
                    alt={`${p.title} cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
            </div>

            <div className="p-4 md:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight">{p.title}</h3>
                    <div className="flex gap-2 opacity-80">
                        {p.links?.primary?.href && (
                            <motion.a
                                {...interactiveAnim}
                                href={p.links.primary.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={p.links.primary.label}
                                className="p-2 rounded-lg border border-black/10 dark:border-white/10"
                            >
                                <ExternalLink size={16} />
                            </motion.a>
                        )}
                        {p.links?.github?.href && (
                            <motion.a
                                {...interactiveAnim}
                                href={p.links.github.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                                className="p-2 rounded-lg border border-black/10 dark:border-white/10"
                            >
                                <Github size={16} />
                            </motion.a>
                        )}
                        {p.screenshots?.length ? (
                            <motion.button
                                {...interactiveAnim}
                                onClick={() => onOpenLightbox(p.screenshots, 0)}
                                title="Gallery"
                                className="p-2 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
                            >
                                <Images size={16} />
                            </motion.button>
                        ) : null}
                    </div>
                </div>

                <p className="text-sm opacity-80">{p.blurb}</p>

                <div className="relative">
                    <div
                        ref={containerRef}
                        className="flex items-center gap-2 flex-nowrap overflow-hidden"
                        aria-live="polite"
                    >
                        {items.slice(0, visibleCount).map((s, i) => (
                            <motion.div
                                key={s + i}
                                {...interactiveAnim}
                                onClick={() => onBadgeClick?.(s)}
                                className="cursor-pointer shrink-0"
                            >
                                <Badge>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
                            </motion.div>
                        ))}

                        {hiddenCount > 0 && (
                            <div className="relative">
                                <motion.button
                                    {...interactiveAnim}
                                    onClick={() => setShowHidden((v) => !v)}
                                    title={`${hiddenCount} more: ${hiddenItems.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`}
                                    className="cursor-pointer shrink-0"
                                >
                                    <Badge>
                                        {hiddenCount > 0 ? ` +${hiddenCount}` : "…"}
                                    </Badge>
                                </motion.button>

                                {showHidden && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        className="absolute z-50 mt-2 right-0 w-48 rounded-lg shadow-lg bg-white/90 dark:bg-black/80 backdrop-blur p-2"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {hiddenItems.map((s, i) => (
                                                <button
                                                    key={s + i}
                                                    onClick={() => {
                                                        onBadgeClick?.(s);
                                                        setShowHidden(false);
                                                    }}
                                                    className="text-left text-sm px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                                                >
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        ref={measureRef}
                        style={{ position: "absolute", left: -9999, top: -9999, pointerEvents: "none" }}
                        aria-hidden
                    >
                        <div className="flex items-center gap-2">
                            {items.map((s, i) => (
                                <div
                                    key={s + i}
                                    ref={(el) => { measureBadgeRefs.current[i] = el; }}
                                    className="inline-block"
                                >
                                    <Badge>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
                                </div>
                            ))}
                            <div ref={measureEllipsisRef} className="inline-block">
                                <Badge>+9</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {p.tags?.length ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {p.tags.map((t, i) => (
                            <motion.span
                                key={i}
                                {...interactiveAnim}
                                onClick={() => onBadgeClick?.(t)}
                                className="text-xs opacity-70 cursor-pointer"
                            >
                                #{t}
                            </motion.span>
                        ))}
                    </div>
                ) : null}

                <div className="pt-2 flex gap-3 flex-wrap">
                    {p.links?.primary ? (
                        <motion.div {...interactiveAnim}>
                            <LinkButton href={p.links.primary.href} label={p.links.primary.label} icon={ExternalLink} />
                        </motion.div>
                    ) : p.links?.github ? (
                        <motion.div {...interactiveAnim}>
                            <LinkButton href={p.links.github?.href} label="GitHub" icon={Github} />
                        </motion.div>
                    ) : (
                        <motion.div {...interactiveAnim}>
                            <LinkButton onClick={() => onOpenLightbox(p.screenshots, 0)} label="Gallery" icon={Images} />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
