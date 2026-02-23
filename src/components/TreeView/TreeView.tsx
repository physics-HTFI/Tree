import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeViewItem } from "./TreeViewItem";
import { useFilteredTreeItemsValue } from "../../jotai/useTreeItems";
import { useSelectedTreeNodeId } from "../../jotai/useSelectedTreeNode";

export function TreeView() {
  // フック
  const tree = useFilteredTreeItemsValue();
  const [selectedItemId, setSelectedItemId] = useSelectedTreeNodeId();

  // イベントハンドラー
  const getItemId = (item: TreeNode) => item.nodeId;
  const getItemLabel = (item: TreeNode) =>
    (item.type === "item" ? item.data.title : item.title) ?? "---";
  const isItemSelectionDisabled = (item: TreeNode) => item.type === "folder";
  const onItemSelectionToggle = (
    _event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => {
    setSelectedItemId(isSelected ? itemId : null);
  };

  return (
    <RichTreeView
      items={tree?.children ?? []}
      selectedItems={selectedItemId}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      isItemSelectionDisabled={isItemSelectionDisabled}
      onItemSelectionToggle={onItemSelectionToggle}
      slots={{ item: CustomTreeViewItem }}
      sx={{
        p: 1,
        position: "sticky", // (1) スクロールしても常に表示する
        top: 0, // (1)
        alignSelf: "flex-start", // (1)
        overflow: "auto", // (2) アイテムが多い場合にスクロール可能にする
        maxHeight: "100vh", // (2)
      }}
    />
  );
}
