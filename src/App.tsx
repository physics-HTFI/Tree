import { useState } from "react";
import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { useSetFolder } from "./jotai/useFolder";
import { Settings } from "./components/Settings/Settings";
import { FileNodeEdit } from "./components/FileNodeEdit/FileNodeEdit";
import Grid from "@mui/material/Grid";
import { Tree } from "./components/Tree/Tree";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const setFolder = useSetFolder();
  const handleSelect = async (handle: FileSystemDirectoryHandle) => {
    await setFolder(handle);
    setIsOpen(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid>
          <Tree />
        </Grid>
        <Grid size="grow">bbb</Grid>
      </Grid>
      <FolderPicker open={isOpen} onSelect={handleSelect} />
      <Settings />
      <FileNodeEdit />
    </>
  );
}

export default App;
