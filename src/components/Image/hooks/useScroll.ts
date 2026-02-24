import { useCallback, useEffect, useRef, useState } from "react";

export function useScroll(speed: number, hasSvg: boolean) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [time, setTime] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(true);
  const scrollTime = (240 - 30 * speed) * 1000;

  useEffect(() => {
    if (!hasSvg || !ref.current || !scrolling) return;
    const ms_p_px = scrollTime / ref.current.clientHeight; // 1pxスクロールするのに要する時間（ms）
    const delay =
      (0.5 * scrollTime * window.innerHeight) / ref.current.clientHeight; // 画面の半分をスクロールするのにかかる時間（ms）
    const id = setInterval(() => {
      setTime((t) => t + ms_p_px);
      if (delay < time) window.scrollBy(0, 1); // 1pxずつスクロールする
    }, ms_p_px);
    return () => clearInterval(id);
  }, [hasSvg, time, scrolling, scrollTime]);

  const timerStart = useCallback(() => {
    setTime(0);
    setScrolling(true);
  }, []);

  const toggleScroll = useCallback(() => {
    setScrolling((s) => !s);
    setTime(scrollTime);
  }, [scrollTime]);

  return { ref, toggleScroll, timerStart, scrolling };
}
