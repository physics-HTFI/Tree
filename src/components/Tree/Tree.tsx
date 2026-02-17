import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useTreeItemsValue } from "./_useTreeItemsValue";
import { useSettingsValue } from "./_useSettingsValue";
import { CustomTreeItem } from "./TreeItem";

export function Tree() {
  const tree = useTreeItemsValue();
  const settings = useSettingsValue();

  const getItemId = (item: TreeNode) => item.nodeId;
  const getItemLabel = (item: TreeNode) => item.title ?? "---";
  const getItemChildren = (item: TreeNode) => {
    if (item.type === "file") return;
    return item.children?.filter((child) => {
      if (child.type === "folder") return true; // フォルダは常に表示する
      const ignore =
        settings.tiers
          ?.map((tier, index) => ({ index, checked: tier.checked === true }))
          ?.filter((tier) => !tier.checked)
          ?.map((tier) => tier.index) ?? [];
      if (ignore.includes(child.tier ?? 0)) return false; // チェックが外れているティアは表示しない
      return true;
    });
  };

  return (
    <RichTreeView
      items={tree}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      getItemChildren={getItemChildren}
      slots={{ item: CustomTreeItem }}
    />
  );
}
