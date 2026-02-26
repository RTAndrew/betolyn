import { useEffect, useRef, useState } from 'react';

const DEFAULT_MESSAGES: Record<number, string[]> = {
  0: ['Hang tight...we are doing some magics.'],
  1: ['The hamsters are getting a workout.'],
  2: ['Okay. One last shot.'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface UseTimeElapsedProps {
  breakpoints: number[];
  maxTime: number;
  enabled: boolean;
  defaultMessage?: string;
  messages?: Record<number, string[]>;
}

export function useTimeElapsed({
  defaultMessage = DEFAULT_MESSAGES[0][0],
  messages = DEFAULT_MESSAGES,
  enabled = true,
  breakpoints,
  maxTime,
}: UseTimeElapsedProps) {
  const lastMatchedIndexRef = useRef<number | null>(null);
  const breakpointsRef = useRef(breakpoints);
  const maxTimeRef = useRef(maxTime);
  const messagesRef = useRef(messages);
  breakpointsRef.current = breakpoints;
  maxTimeRef.current = maxTime;
  messagesRef.current = messages;

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [message, setMessage] = useState<string | null>(defaultMessage);
  const hasPassedMaxRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const startTime = Date.now();
    lastMatchedIndexRef.current = null;
    hasPassedMaxRef.current = false;
    setTimeElapsed(0);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const bp = breakpointsRef.current;
      const msgs = messagesRef.current;
      const max = maxTimeRef.current;

      let matchedIndex: number | null = null;
      for (let i = bp.length - 1; i >= 0; i--) {
        if (elapsed >= bp[i]) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex !== null && matchedIndex !== lastMatchedIndexRef.current) {
        lastMatchedIndexRef.current = matchedIndex;
        const arr = msgs[matchedIndex];
        if (arr?.length) {
          setMessage(pickRandom(arr));
        }
      }

      if (!hasPassedMaxRef.current && elapsed >= max) {
        hasPassedMaxRef.current = true;
        setTimeElapsed(elapsed);
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [enabled]);

  return {
    timeElapsed,
    isPastMaxTime: timeElapsed >= maxTime,
    message,
  };
}
