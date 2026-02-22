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

export function FolderEditor() {
  const settings = useAppSettingsValue();
  const defaultFolder = useSelectedFolderNodeValue();
  const { unselect } = useUnselect();
  const [folder, setFolder] = useState<FolderNode | null>(defaultFolder);
  const [value, setValue] = useState(0);
  const { updateAsync } = useUpdateFolderNode(folder?.nodeId);
  const { debounced: debouncedUpdate } = useDebounce(updateAsync);

  if (folder?.nodeId !== defaultFolder?.nodeId) {
    setFolder(defaultFolder);
  }

  if (!folder) return null;

  const update = (newFolder: FolderNode) => {
    setFolder(newFolder);
    debouncedUpdate(newFolder, 1000);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog open={true} onClose={unselect}>
      <DialogContent sx={{ width: 400 }}>
        <Path
          folder={folder}
          label={settings?.labels?.folder?.path}
          onChange={update}
        />
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="追加" />
            <Tab label="並び替え" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
