import { isUrl as _isUrl } from "@/generics/utils/isUrl";

export const validateItemNode = {
  canAddItem,
  canOverwrite,
  isUrl,
  modifyItemNode,
};

function isValidItem(item: ItemEntry) {
  if (item.title === undefined) return false;
  return true;
}

function canAddItem(item?: ItemEntry, parent?: FolderNode) {
  if (!item?.title || !parent) return false;
  if (!isValidItem(item)) return false;
  const duplicated = parent.children?.some(
    (c) =>
      c.type === "item" &&
      c.entry.title?.toLowerCase() === item.title?.toLowerCase(),
  );
  if (duplicated) return false;
  return true;
}

function canOverwrite(item: ItemEntry, node: ItemNode) {
  if (item.title === node.entry.title) return true;
  const duplicated = node.parent?.children?.some(
    (c) =>
      c.type === "item" &&
      c.entry.title?.toLowerCase() === item.title?.toLowerCase() &&
      c.nodeId !== node.nodeId,
  );
  if (duplicated) return false;
  return true;
}

function isUrl(item: ItemEntry) {
  return _isUrl(item.path);
}

function modifyItemNode(item: ItemEntry) {
  if (!item.title) item.title = "";
  if (!item.path) item.path = undefined;
  if (!item.notes) item.notes = undefined;
  if (item.tier === 0) item.tier = undefined;
  if (!item.start || item.start <= 0) item.start = undefined;
  if (!item.ticks || item.ticks <= 0) item.ticks = undefined;
  if (!item.highlighted) item.highlighted = undefined;
  if (!item.window) item.window = undefined;
  if (_isUrl(item.path)) item.window = undefined;
}
