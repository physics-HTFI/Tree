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
import { AddFolder } from "./ui/AddFolder";

export function FolderEditor() {
  const settings = useAppSettingsValue();
  const defaultFolder = useSelectedFolderNodeValue();
  const { unselect } = useUnselect();
  const [folder, setFolder] = useState<FolderNode | null>(defaultFolder);
  const [tabValue, setTabValue] = useState(0);
  const { updateAsync } = useUpdateFolderNode();
  const { debounced: debouncedUpdate } = useDebounce(updateAsync);

  if (folder?.nodeId !== defaultFolder?.nodeId) {
    setFolder(defaultFolder);
  }

  if (!folder?.handle) return null;

  const updatePath = async (path?: string) => {
    const newFolder = { ...folder, path };
    setFolder(newFolder);
    await updateAsync(newFolder);
  };

  const addItem = async (item: ItemData) => {
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
    await updateAsync(newFolder);
  };

  const addFolder = async (title: string, path?: string) => {
    if (!folder.handle) return;
    try {
      const subFolderHandle = await folder.handle?.getDirectoryHandle(title, {
        create: true,
      });
      const subFolder: FolderNode = {
        type: "folder",
        title,
        path,
        nodeId: createId(),
        handle: subFolderHandle,
        children: [],
      };
      const newFolder = { ...folder };
      newFolder.children = [subFolder, ...newFolder.children];
      setFolder(newFolder);
      await updateAsync(subFolder);
      await updateAsync(newFolder);
    } catch {
      return;
    }
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
            <Tab label="アイテム追加" />
            <Tab label="フォルダ追加" />
            <Tab label="並び替え" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <AddItem onAdd={addItem} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AddFolder onAdd={addFolder} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item Three
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
