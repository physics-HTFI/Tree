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
import { AddFolder } from "./ui/AddFolder";
import { SortItems } from "./ui/SortItems";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelected } from "@/models/hooks/atomSelected";

export function FolderEditor() {
  const folder = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;
  const unselect = useSetAtom(atomsSelected.unselect);
  const [tabValue, setTabValue] = useState(0);

  if (!folder?.handle) return null;

  return (
    <Dialog open={true} onClose={unselect}>
      <DialogTitle>{folder.title}</DialogTitle>
      <DialogContent sx={{ width: 500, minHeight: "60vh" }}>
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
          <AddItem />
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
