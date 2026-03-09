import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeViewItem } from "./ui/TreeViewItem";
import { useState } from "react";
import { atomFilteredTreeValue } from "@/models/hooks/atomFilteredTree";
import { useAtom, useAtomValue } from "jotai";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { atomOptions } from "@/models/hooks/atomOptions";

export function TreeView() {
  // フック
  const hiddenTiers = useAtomValue(atomOptions.hiddenTiers);
  const tree = useAtomValue(atomFilteredTreeValue);
  const [selectedItemId, setSelectedItemId] = useAtom(atomsSelectedNode.nodeId);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [curHiddenTiers, setCurHiddenTiers] = useState<Set<number>>(new Set());

  // ティア変更時の自動開閉
  const isSame =
    hiddenTiers.size === curHiddenTiers.size &&
    [...curHiddenTiers].every((x) => hiddenTiers.has(x));
  if (!isSame) {
    const isTier0Hidden = hiddenTiers?.has(0);
    setCurHiddenTiers(new Set(hiddenTiers));
    if (isTier0Hidden) {
      const getIds = (subTree: TreeNode | undefined, ids: string[]) => {
        if (subTree?.type === "folder") {
          if (subTree !== tree) ids.push(subTree.nodeId);
          subTree.children.forEach((child) => getIds(child, ids));
        }
        return ids;
      };
      console.log(getIds(tree, []));
      setExpandedIds(getIds(tree, []));
    } else {
      setExpandedIds([]);
    }
  }

  const getLabel = (item: TreeNode) => {
    const label = item.type === "item" ? item.entry.title : item.title;
    if (!label) return "---";
    return label;
  };

  return (
    <RichTreeView
      items={tree?.children ?? []}
      itemChildrenIndentation={10}
      selectedItems={selectedItemId}
      expandedItems={expandedIds}
      getItemId={(item) => item.nodeId}
      isItemSelectionDisabled={(item) => item.type === "folder"}
      getItemLabel={getLabel}
      onSelectedItemsChange={(_, id) => setSelectedItemId(id ?? undefined)}
      onExpandedItemsChange={(_, ids) =>
        setExpandedIds(curHiddenTiers ? trimIds(expandedIds, ids) : ids)
      }
      slots={{ item: CustomTreeViewItem }}
      sx={{
        p: 1,
        minWidth: 200,
        position: "sticky", // (1) スクロールしても常に表示する
        top: 0, // (1)
        alignSelf: "flex-start", // (1)
        overflow: "auto", // (2) アイテムが多い場合にスクロール可能にする
        maxHeight: "100vh", // (2)
      }}
    />
  );
}

/**
 * 親子関係にあるフォルダのIDのみを残す
 */
function trimIds(preIds: string[], currentIds: string[]): string[] {
  if (currentIds.length <= preIds.length) return currentIds;
  const addedId = currentIds.find((id) => !preIds.includes(id)) ?? "";
  return currentIds.filter((id) => addedId.startsWith(id));
}
