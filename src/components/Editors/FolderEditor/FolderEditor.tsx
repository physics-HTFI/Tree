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
import { createId } from "@/utils/createId";
import { AddFolder } from "./ui/AddFolder";
import { SortItems } from "./ui/SortItems";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";
import { existsSvg } from "@/utils/existsSvg";

export function FolderEditor() {
  const defaultFolder =
    useAtomValue(atomsSelected.nodeValue).selectedFolderNode || null;
  const unselectAsync = useSetAtom(atomsSelected.unselectAsync);
  const [folder, setFolder] = useState<FolderNode | null>(defaultFolder);
  const [tabValue, setTabValue] = useState(0);
  const updateAsync = useSetAtom(atomsSelected.setFolderNodeAsync);

  if (folder?.nodeId !== defaultFolder?.nodeId) {
    setFolder(defaultFolder);
  }

  if (!folder?.handle) return null;

  const addItem = async (item: ItemEntry) => {
    const newFolder = { ...folder };
    const newItem: ItemNode = {
      type: "item",
      nodeId: createId({ type: "item", title: item.title }, folder.nodeId),
      parent: newFolder,
      hasSvg: await existsSvg(folder.handle, item.title),
      entry: item,
    };
    newFolder.children = [newItem, ...newFolder.children];
    setFolder(newFolder);
    await updateAsync(newFolder);
  };

  return (
    <Dialog open={true} onClose={unselectAsync}>
      <DialogTitle>{folder.title}</DialogTitle>
      <DialogContent sx={{ width: 400, minHeight: "60vh" }}>
        <Path />
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
          <AddFolder />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <SortItems />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
