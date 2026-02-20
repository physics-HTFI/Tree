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
import { useAppSettingsValue } from "./_useAppSettingsValue";

interface CustomTreeItemProps
  extends
    Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const settings = useAppSettingsValue();
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

  const item = useTreeItemModel<TreeNode>(itemId)!;
  const keyLabel =
    item.type === "item"
      ? settings?.keys?.find((key) => key.key === item.data.key)?.label
      : undefined;
  const tier =
    item.type === "item" ? settings?.tiers?.[item.data.tier ?? 0] : undefined;
  const sx = {
    color: tier?.color,
    textDecoration: tier?.underline ? "underline" : undefined,
  };
  const color =
    item.type === "item" && item?.data.highlighted ? "pink" : undefined;

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
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} sx={sx} />
            {item.type === "item" ? (
              <>
                {item.data.ticks && (
                  <Typography variant="caption">🕒</Typography>
                )}
                {item.data.notes && (
                  <Typography variant="caption">📝</Typography>
                )}
                {keyLabel && (
                  <Typography variant="caption" color="textSecondary">
                    {keyLabel}
                  </Typography>
                )}
              </>
            ) : (
              <IconButton
                onClick={(e) => e.stopPropagation()}
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
