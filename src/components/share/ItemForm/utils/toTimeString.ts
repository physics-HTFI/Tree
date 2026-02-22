/**
 *  秒を "M:SS" の形式の文字列に変換する
 */
export function toTimeString(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
