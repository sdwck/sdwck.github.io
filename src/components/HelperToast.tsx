import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface HelperToastProps {
    onClose: () => void;
    onExpire?: () => void;
    arrowTarget?: { x: number; y: number } | null;
}

const toastVariants: Variants = {
    initial: {
        opacity: 0,
        y: -20,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        x: 80,
        scale: 0.9,
        transition: {
            duration: 0.3,
            ease: [0.76, 0, 0.24, 1]
        }
    }
};

type DismissalReason = "click" | "timer";

export default function HelperToast({ onClose, onExpire, arrowTarget }: HelperToastProps) {
    const [isToastReady, setIsToastReady] = useState(false);
    const [pathData, setPathData] = useState<string | null>(null);
    const [dismissalReason, setDismissalReason] = useState<DismissalReason | null>(null);

    const toastRef = useRef<HTMLDivElement>(null);
    const hideTimerRef = useRef<number | null>(null);
    const animationDuration = 0.7;

    const handleGotItClick = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }
        setDismissalReason("click");
    };

    useEffect(() => {
        if (isToastReady && arrowTarget && toastRef.current) {
            const toastRect = toastRef.current.getBoundingClientRect();
            const startX = toastRect.left + toastRect.width / 2;
            const startY = toastRect.top;
            const endX = arrowTarget.x;
            const endY = arrowTarget.y;
            const newPath = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
            setPathData(newPath);
        }
    }, [isToastReady, arrowTarget]);

    useEffect(() => {
        hideTimerRef.current = setTimeout(() => {
            setDismissalReason("timer");
        }, 10000);

        return () => {
            if (hideTimerRef.current !== null) {
                clearTimeout(hideTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!dismissalReason) return;

        const toastHideDelay = 100;
        const closeTimer = setTimeout(() => {
            if (dismissalReason === 'timer') {
                onExpire ? onExpire() : onClose();
            } else {
                onClose();
            }
        }, toastHideDelay);

        return () => clearTimeout(closeTimer);
    }, [dismissalReason, onClose, onExpire]);


    return (
        <>
            <AnimatePresence>
                {pathData && !dismissalReason && (
                    <motion.svg
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 w-full h-full z-40 pointer-events-none"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>

                            <filter id="arrow-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <motion.marker
                                id="arrowhead-stylish"
                                markerWidth="8"
                                markerHeight="6"
                                refX="8"
                                refY="3"
                                orient="auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: animationDuration - 0.05 }}
                            >
                                <polygon points="0 0, 8 3, 0 6" fill="url(#arrow-gradient)" />
                            </motion.marker>
                        </defs>

                        <motion.path
                            d={pathData}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: animationDuration, ease: "easeInOut", delay: 0.1 }}
                            strokeWidth="2.5"
                            stroke="url(#arrow-gradient)"
                            filter="url(#arrow-glow)"
                            markerEnd="url(#arrowhead-stylish)"
                            fill="none"
                        />
                    </motion.svg>
                )}
            </AnimatePresence>

            <motion.div
                ref={toastRef}
                variants={toastVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onAnimationComplete={() => setIsToastReady(true)}
                className="fixed right-6 top-20 z-50"
            >
                <div className="max-w-xs backdrop-blur rounded-2xl p-4 shadow-2xl border border-black/8 dark:border-white/6 bg-white/70 dark:bg-black/40">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/10">
                            <Eye size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="font-extrabold text-sm tracking-tight">Quick tip</div>
                            <div className="text-sm opacity-90 mt-1">
                                Hovering activates the background. Use <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/6 font-medium"><Eye size={14} /> / <EyeOff size={14} /></span> button to focus on it.
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={handleGotItClick} className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">Got it</button>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}