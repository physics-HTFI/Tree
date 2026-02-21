/**
 *  "MM:SS" の形式の文字列を秒に変換する
 */
export function fromTimeString(timeString: string): number | undefined {
  const split = timeString.split(":");
  if (split.length !== 2 || split.some((num) => isNaN(Number(num))))
    return undefined;
  const [min, sec] = split.map(Number);
  return min * 60 + sec;
}
