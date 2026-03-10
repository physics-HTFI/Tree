export const modifierFolderNode = {
  canAddFolder: (
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

  modifyNewFolder: (folder: NewFolderNode) => {
    folder.title = folder.title.trim();
    folder.path = folder.path?.trim();
    if (folder.path === "") folder.path = undefined;
  },

  canRemoveChild: (nodeId: string, children: TreeNode[]) => {
    const target = children.find((child) => child.nodeId === nodeId);
    if (!target) return false;
    if (target.type === "folder") return false;
    if (target.hasSvg) return false;
    return true;
  },
};
