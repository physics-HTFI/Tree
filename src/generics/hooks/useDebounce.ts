import { useCallback, useRef } from "react";

export function useDebounce<T>(fn: (arg: T) => void): {
  debounced: (arg: T, delay: number) => void;
  cancel: () => void;
  consume: () => void;
} {
  const ref = useRef<{ time: ReturnType<typeof setTimeout>; args: T } | null>(
    null,
  );

  const cancel = useCallback(() => {
    if (!ref.current) return;
    clearTimeout(ref.current?.time);
    ref.current = null;
  }, []);

  const debounced = useCallback(
    (args: T, delay: number) => {
      cancel();
      ref.current = {
        time: setTimeout(() => {
          fn(args);
          cancel();
        }, delay),
        args,
      };
    },
    [cancel, fn],
  );

  const consume = useCallback(() => {
    if (!ref.current) return;
    fn(ref.current.args); // 即時実行
    cancel();
  }, [fn, cancel]);

  return { debounced, cancel, consume };
}
