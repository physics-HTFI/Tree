export function getWheeledNumber(
  type: "time" | "start" | "ticks",
  item: ItemData,
  settings: AppSettings,
  event: React.WheelEvent,
): number | undefined {
  if (event.target !== document.activeElement) return item[type]; // 未フォーカス時は無視する（誤変更を防ぐため）
  const defaultValue = settings?.defaults?.[type];
  const constants = {
    time: { min: 10, delta: 10 },
    start: { min: 0, delta: 1 },
    ticks: { min: 30, delta: 1 },
  }[type];
  if (item[type] === undefined) return defaultValue ?? constants.min;
  return Math.max(
    constants.min,
    item[type] + (event.deltaY > 0 ? 1 : -1) * constants.delta,
  );
}
