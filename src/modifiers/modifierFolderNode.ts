type Value = {
  title: string;
  path?: string;
};

export const modifierFolderNode = {
  canAdd: (folder?: Value, parent?: FolderNode) => {
    if (!folder || !parent) return false;

    // title
    if (folder.title === "") return false;
    const duplicated = parent.children?.some(
      (child) =>
        child.type === "folder" &&
        child.title.toLowerCase() === folder.title.toLowerCase(),
    );
    if (duplicated) return false;

    // path
    if (folder.path === "") return false; // 空文字は許可しない（未指定の場合はundefinedにする）

    return true;
  },

  modify: (folder: Value) => {
    if (folder.path === "") folder.path = undefined;
  },
};
