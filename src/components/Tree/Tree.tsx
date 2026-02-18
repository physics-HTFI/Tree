import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useTreeItemsValue } from "./_useTreeItemsValue";
import { useSettingsValue } from "./_useSettingsValue";
import { CustomTreeItem } from "./TreeItem";
import { useSelectedItemId } from "./_useSelectedItemId";

export function Tree() {
  // フック
  const tree = useTreeItemsValue();
  const settings = useSettingsValue();
  const [selectedItemId, setSelectedItemId] = useSelectedItemId();

  // イベントハンドラー
  const getItemId = (item: TreeNode) => item.nodeId;
  const getItemLabel = (item: TreeNode) => item.title ?? "---";
  const isItemSelectionDisabled = (item: TreeNode) => item.type === "folder";
  const getItemChildren = (item: TreeNode) => {
    if (item.type === "file") return;
    return item.children?.filter((child) => {
      if (child.type === "folder") return true; // フォルダは常に表示する
      const ignore =
        settings.tiers
          ?.map((tier, index) => ({ index, checked: tier.checked === true }))
          ?.filter((tier) => !tier.checked)
          ?.map((tier) => tier.index) ?? [];
      if (ignore.includes(child.data.tier ?? 0)) return false; // チェックが外れているティアは表示しない
      return true;
    });
  };
  const onItemSelectionToggle = (
    _event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => {
    setSelectedItemId(isSelected ? itemId : null);
  };

  return (
    <RichTreeView
      items={tree}
      selectedItems={selectedItemId}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      getItemChildren={getItemChildren}
      isItemSelectionDisabled={isItemSelectionDisabled}
      onItemSelectionToggle={onItemSelectionToggle}
      slots={{ item: CustomTreeItem }}
    />
  );
}
