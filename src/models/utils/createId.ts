export function createId(
  entry: { type: "folder"; title: string } | { type: "item"; title?: string },
  parentId: string,
): string {
  if (entry.type === "folder") {
    return `${parentId}${entry.title}/`;
  } else {
    const random =
      Date.now().toString(36) + Math.random().toString(36).slice(2);
    return `${parentId}${entry.title ?? "notitle"}-${random}`;
  }
}
