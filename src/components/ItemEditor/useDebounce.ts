import { useCallback, useRef } from "react";

export function useDebounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): { debounced: (...args: T) => void; cancel: () => void } {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const cancel = useCallback(() => {
    if (timerRef.current !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }
  }, []);

  const debounced = useCallback(
    (...args: T) => {
      cancel();
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [cancel, delay, fn],
  );

  return { debounced, cancel };
}
