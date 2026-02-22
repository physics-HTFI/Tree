import { useCallback, useRef } from "react";

export function useDebounce<T>(fn: (arg: T) => void): {
  debounced: (arg: T, delay: number) => void;
  cancel: () => void;
} {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const cancel = useCallback(() => {
    if (timerRef.current !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }
  }, []);

  const debounced = useCallback(
    (args: T, delay: number) => {
      cancel();
      timerRef.current = setTimeout(() => fn(args), delay);
    },
    [cancel, fn],
  );

  return { debounced, cancel };
}
