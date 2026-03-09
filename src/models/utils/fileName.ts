export const fileName = {
  isItemFile: (name: string) => isFile(name, [".svg", ".mp3"]),
  isSvgFile: (name: string) => isFile(name, [".svg"]),
  isMp3File: (name: string) => isFile(name, [".mp3"]),

  baseName: (name: string) => {
    const match = name.match(/^(.*?)(\.[^.]+)?$/);
    return match ? match[1] : name;
  },

  trimRootFromNodeId: (nodeId: string) => nodeId.replace(/^([^/]*\/){2}/, ""),
};

function isFile(name: string, extensions: string[]) {
  if (!name || name.startsWith(".")) return false;
  const lowerName = name.toLocaleLowerCase();
  return extensions.some((ext) => lowerName.endsWith(ext));
}
