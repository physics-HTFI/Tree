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
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useSetSelectedTreeNodeId } from "../../jotai/useSelectedTreeNode";

interface CustomTreeViewItemProps
  extends
    Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const CustomTreeViewItem = React.forwardRef(function CustomTreeViewItem(
  props: CustomTreeViewItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const settings = useAppSettingsValue();
  const setSelectedTreeNodeId = useSetSelectedTreeNodeId();
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
  const keyLabel =
    node.type === "item"
      ? settings?.keys?.find((key) => key.key === node.data.key)?.label
      : undefined;
  const tier =
    node.type === "item" ? settings?.tiers?.[node.data.tier ?? 0] : undefined;
  const sx = {
    color: tier?.color,
    textDecoration: tier?.underline ? "underline" : undefined,
  };
  const color =
    node.type === "item" && node?.data.highlighted ? "mistyrose" : undefined;

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)} sx={{ background: color }}>
        <TreeItemContent
          {...getContentProps()}
          sx={{
            py: 0,
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
            spacing={0.5}
            sx={{
              alignItems: "center",
              // width: item.type === "item" ? "100%" : undefined, // アイコンを右端に寄せる
            }}
          >
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} sx={sx} />
            {node.type === "item" ? (
              <Typography
                variant="caption"
                color="textSecondary"
                whiteSpace="nowrap"
              >
                {node.hasSvg && "🖼️"}
                {node.data.ticks !== undefined && "🕒"}
                {!!node.data.notes && "📝"}
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
        borderRight: "1px solid gainsboro",
        color: "transparent",
      }}
    >
      i
    </Box>
  );
}
