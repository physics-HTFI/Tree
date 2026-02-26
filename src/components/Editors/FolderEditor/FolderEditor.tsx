import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import { Path } from "./ui/Path";
import { TabPanel } from "./ui/TabPanel";
import { AddItem } from "./ui/AddItem";
import { createId } from "../../../utils/createId";
import { AddFolder } from "./ui/AddFolder";
import { SortItems } from "./ui/SortItems";
import { useDebounce } from "../../../generics/hooks/useDebounce";
import { atomAppSettingsValue } from "../../../jotai/share/atomAppSettings";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelected } from "../../../jotai/share/atomSelected";

export function FolderEditor() {
  const settings = useAtomValue(atomAppSettingsValue);
  const defaultFolder = useAtomValue(atomsSelected.folderNodeValue);
  const unselectAsync = useSetAtom(atomsSelected.unselectAsync);
  const [folder, setFolder] = useState<FolderNode | null>(defaultFolder);
  const [tabValue, setTabValue] = useState(0);
  const updateAsync = useSetAtom(atomsSelected.setFolderNodeAsync);
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

  const addItem = async (item: ItemEntry) => {
    const newFolder = { ...folder };
    const newItem: ItemNode = {
      type: "item",
      nodeId: createId({ type: "item", title: item.title }, folder.nodeId),
      parent: newFolder,
      hasSvg: false,
      entry: item,
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
        nodeId: createId({ type: "folder", title }, folder.nodeId),
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

  const updateChildren = async (items: TreeNode[]) => {
    if (!folder) return;
    const newFolder = { ...folder, children: items };
    setFolder(newFolder);
    debouncedUpdate(newFolder, 1000);
  };

  return (
    <Dialog open={true} onClose={unselectAsync}>
      <DialogTitle>{folder.title}</DialogTitle>
      <DialogContent sx={{ width: 400, minHeight: "60vh" }}>
        <Path
          path={folder?.path}
          label={settings.labels?.path}
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
          <SortItems defaultList={folder.children} onChange={updateChildren} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
