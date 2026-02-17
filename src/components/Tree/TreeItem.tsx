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
import { IconButton, Stack, Typography } from "@mui/material";
import { useSettingsValue } from "./_useSettingsValue";

interface CustomTreeItemProps
  extends
    Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const settings = useSettingsValue();
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
  const tier =
    item.type === "file" ? settings?.tiers?.[item?.tier ?? 0] : undefined;
  const sx = {
    color: tier?.color,
    textDecoration: tier?.underline ? "underline" : undefined,
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()} sx={{ py: 0 }}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} sx={sx} />
            {item.type === "file" ? (
              <>
                <Typography variant="caption">
                  {item?.ticks ? "🕒" : undefined}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {item?.key}
                </Typography>
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
