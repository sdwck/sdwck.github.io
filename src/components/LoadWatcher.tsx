import { useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

type Props = {
  onReady: (ready: boolean) => void;
  activeProject: string | null;
};

export default function LoadWatcher({ onReady, activeProject }: Props) {
  const { loaded, total, progress, errors } = useProgress();
  const lastProjectRef = useRef<string | null>(null);
  const readyRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastProjectRef.current !== activeProject) {
      lastProjectRef.current = activeProject;
      readyRef.current = false;
      onReady(false);
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    }
  }, [activeProject, onReady]);

  useEffect(() => {
    const totalCount = total;
    const loadedCount = loaded;

    if (readyRef.current) return;

    if (totalCount === 0) {
      fallbackTimerRef.current = window.setTimeout(() => {
        readyRef.current = true;
        onReady(true);
      }, 120);
      return () => {
        if (fallbackTimerRef.current) {
          window.clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
      };
    }

    if (totalCount > 0 && loadedCount >= totalCount) {
      fallbackTimerRef.current = window.setTimeout(() => {
        readyRef.current = true;
        onReady(true);
        fallbackTimerRef.current = null;
      }, 80);
    } else {
      onReady(false);

      if (!fallbackTimerRef.current) {
        fallbackTimerRef.current = window.setTimeout(() => {
          readyRef.current = true;
          onReady(true);
          fallbackTimerRef.current = null;
        }, 7000);
      }
    }

    return () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [loaded, total, progress, errors, onReady]);

  return null;
}
