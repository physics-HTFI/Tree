import { Box, Dialog, DialogContent, Tab, Tabs } from "@mui/material";
import {
  useSelectedFolderNodeValue,
  useUnselect,
} from "../../jotai/useSelectedTreeNode";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useState } from "react";
import { Path } from "./ui/Path";
import { TabPanel } from "./ui/TabPanel";
import { useUpdateFolderNode } from "../../jotai/useTreeItems";
import { useDebounce } from "../../hooks/useDebounce";
import { AddItem } from "./ui/AddItem";
import { createId } from "../../utils/createId";

export function FolderEditor() {
  const settings = useAppSettingsValue();
  const defaultFolder = useSelectedFolderNodeValue();
  const { unselect } = useUnselect();
  const [folder, setFolder] = useState<FolderNode | null>(defaultFolder);
  const [tabValue, setTabValue] = useState(0);
  const { updateAsync } = useUpdateFolderNode(folder?.nodeId);
  const { debounced: debouncedUpdate } = useDebounce(updateAsync);

  if (folder?.nodeId !== defaultFolder?.nodeId) {
    setFolder(defaultFolder);
  }

  if (!folder) return null;

  const updatePath = (path?: string) => {
    const newFolder = { ...folder, path };
    setFolder(newFolder);
    debouncedUpdate(newFolder, 100);
  };

  const addItem = (item: ItemData) => {
    const newFolder = { ...folder };
    const newItem: ItemNode = {
      type: "item",
      nodeId: createId(),
      parent: newFolder,
      hasSvg: false,
      data: item,
    };
    newFolder.children = [newItem, ...newFolder.children];
    setFolder(newFolder);
    debouncedUpdate(newFolder, 100);
  };

  return (
    <Dialog open={true} onClose={unselect}>
      <DialogContent sx={{ width: 400, minHeight: "60vh" }}>
        <Path
          path={folder?.path}
          label={settings?.labels?.folder?.path}
          onChange={updatePath}
        />
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="追加" />
            <Tab label="並び替え" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <AddItem onAdd={addItem} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Item Two
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
