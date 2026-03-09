export function findAudio(referenceTree?: FolderNode, path?: string) {
  if (!path || !referenceTree) return {};

  const split = path.split("/");
  let current = referenceTree;
  for (let i = 0; i < split.length - 1; i++) {
    const name = split[i];
    const next = current?.children.find(
      (child) => child.type === "folder" && child.title === name,
    );
    if (!next || next.type !== "folder") return {};
    current = next;
  }

  return { handle: current.handle, name: split.at(-1) };
}
