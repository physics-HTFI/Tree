export const modifierFolderNode = {
  canAdd: (
    folder: NewFolderNode,
    parent?: FolderNode,
  ): parent is FolderNode => {
    if (!parent) return false;

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

  modify: (folder: NewFolderNode) => {
    if (folder.path === "") folder.path = undefined;
  },
};
