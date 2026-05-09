import { useEffect, useRef, useState } from 'react';

import { pickRandom } from '@/utils/pick-random';

const DEFAULT_MESSAGES: Record<number, string[]> = {
  0: [
    'Que recua é carro. Segure firme!',
    'A luta continua... e nós também para que isto funcione',
    'A demorar mais do que o esperado, mas não somos o PIIM. Prometemos!',
  ],
  1: [
    'Tá quase, tá quase, tá quase... 😗🎵',
    'Nosso tempo de resposta é mais rápido do que o Maria Pia',
    'Que dá volta é cinto. Essa ficha vai entrar!',
  ],
  2: [
    'Últimos ajustes e tá no beijo',
    'Se piscaste, quase perdeste: estamos a finalizar',
    'Quase lá, família. Só a fechar a cena',
  ],
};

interface UseTimeElapsedProps {
  breakpoints: number[];
  maxTime: number;
  enabled: boolean;
  defaultMessage?: string;
  messages?: Record<number, string[]>;
}

export function useTimeElapsed({
  defaultMessage = pickRandom(DEFAULT_MESSAGES[0]),
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
      const breakpointReference = breakpointsRef.current;
      const msgs = messagesRef.current;
      const max = maxTimeRef.current;

      let matchedIndex: number | null = null;
      for (let i = breakpointReference.length - 1; i >= 0; i--) {
        if (elapsed >= breakpointReference[i]) {
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
        clearInterval(interval);
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
