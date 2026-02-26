import { useCallback, useEffect, useRef, useState } from "react";

export function useScroll(speed: number) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [time, setTime] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(false);
  const scrollTime = (240 - 30 * speed) * 1000;

  const height = useCallback(() => ref.current?.clientHeight ?? 0, []);
  const overflow = useCallback(() => window.innerHeight < height(), [height]);

  useEffect(() => {
    const imageHeight = height();
    if (!scrolling || imageHeight === 0) return;
    const ms_p_px = scrollTime / imageHeight; // 1pxスクロールするのに要する時間（ms）
    const delay = (0.5 * scrollTime * window.innerHeight) / imageHeight; // 画面の半分をスクロールするのにかかる時間（ms）
    const id = setInterval(() => {
      setTime((t) => t + ms_p_px);
      if (delay < time) window.scrollBy(0, 1); // 1pxずつスクロールする
    }, ms_p_px);
    return () => clearInterval(id);
  }, [time, scrolling, scrollTime, height]);

  const timerStart = useCallback(() => {
    setTime(0);
    setScrolling(overflow());
  }, [overflow]);

  const timerStop = useCallback(() => {
    if (scrolling) setScrolling(false);
  }, [scrolling]);

  const toggleScroll = useCallback(() => {
    setScrolling((s) => overflow() && !s);
    setTime(scrollTime); // スクロール開始待ち時間をなくして、すぐにスクロールできるようにする
  }, [scrollTime, overflow]);

  return { ref, toggleScroll, timerStart, timerStop, scrolling };
}
