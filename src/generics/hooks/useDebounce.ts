import { useCallback, useRef } from "react";

export function useDebounce<T extends unknown[]>(
  fn: (...args: T) => void,
): {
  debounced: (delay: number, ...args: T) => void;
  cancel: () => void;
  consume: () => void;
} {
  const ref = useRef<
    { time: ReturnType<typeof setTimeout>; args: T } | undefined
  >(undefined);

  const cancel = useCallback(() => {
    if (!ref.current) return;
    clearTimeout(ref.current?.time);
    ref.current = undefined;
  }, []);

  const debounced = useCallback(
    (delay: number, ...args: T) => {
      cancel();
      ref.current = {
        time: setTimeout(() => {
          fn(...args);
          cancel();
        }, delay),
        args,
      };
    },
    [cancel, fn],
  );

  const consume = useCallback(() => {
    if (!ref.current) return;
    fn(...ref.current.args); // 即時実行
    cancel();
  }, [fn, cancel]);

  return { debounced, cancel, consume };
}
