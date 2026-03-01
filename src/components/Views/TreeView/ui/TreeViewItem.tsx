import {
  TreeItemCheckbox,
  TreeItemContent,
  TreeItemDragAndDropOverlay,
  TreeItemGroupTransition,
  TreeItemIcon,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemProvider,
  TreeItemRoot,
  useTreeItem,
  useTreeItemModel,
  type UseTreeItemParameters,
} from "@mui/x-tree-view";
import React from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  type SxProps,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { atomsSelected } from "@/jotai/atomSelected";

interface CustomTreeViewItemProps
  extends
    Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const CustomTreeViewItem = React.forwardRef(function CustomTreeViewItem(
  props: CustomTreeViewItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const settings = useAtomValue(atomAppSettingsValue);
  const setSelectedTreeNodeId = useSetAtom(atomsSelected.nodeId);
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const node = useTreeItemModel<TreeNode>(itemId)!;
  const isItem = node.type === "item";
  const keyLabel = isItem
    ? settings?.keys?.find((key) => key.key === node.entry.key)?.label
    : undefined;
  const tier = isItem ? settings?.tiers?.[node.entry.tier ?? 0] : undefined;
  const sx: SxProps = {
    color: tier?.color,
    textDecoration: tier?.underline ? "underline" : undefined,
    maxWidth: settings?.max_item_width,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: isItem && (node.entry.tier ?? 0) === 0 ? "0.7rem" : "0.82rem",
  };
  const color = isItem && node?.entry.highlighted ? "mistyrose" : undefined;

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)} sx={{ background: color }}>
        <TreeItemContent
          {...getContentProps()}
          sx={{
            py: 0,
            height: 20,
            // フォーカスリングを表示しない
            ":is([data-focused]):not([data-selected]):not(:hover)": {
              backgroundColor: "transparent",
            },
          }}
        >
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} slots={{ endIcon: VerticalLine }} />
          </TreeItemIconContainer>
          <Stack
            direction="row"
            spacing={0.7}
            sx={{
              alignItems: "center",
              // width: item.type === "item" ? "100%" : undefined, // アイコンを右端に寄せる
            }}
          >
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} sx={sx} />
            {node.readonly ? null : node.type === "item" ? (
              <Typography
                variant="caption"
                color="textSecondary"
                whiteSpace="nowrap"
                fontSize="0.7rem"
                sx={{
                  visibility: "hidden",
                  "#root:hover &": {
                    visibility: "visible",
                  },
                }}
              >
                {node.hasSvg && "🖼️"}
                {node.entry.ticks !== undefined && "🕒"}
                {!!node.entry.notes && "📝"}
                {!!keyLabel && keyLabel}
              </Typography>
            ) : (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTreeNodeId(node.nodeId);
                }}
                sx={{
                  p: 0,
                  pb: 0.3,
                  display: "inline-block",
                  fontSize: "0.8rem",
                  opacity: 0.3,
                  ":hover": { opacity: 1 },
                }}
              >
                ➕
              </IconButton>
            )}
          </Stack>
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

function VerticalLine() {
  return (
    <Box
      sx={{
        borderRight: "1px solid #DDD",
        color: "transparent",
        width: 1,
      }}
    >
      i
    </Box>
  );
}
