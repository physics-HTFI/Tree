import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { Settings } from "./components/Settings/Settings";
import { FileNodeEdit } from "./components/FileNodeEdit/FileNodeEdit";
import Grid from "@mui/material/Grid";
import { Tree } from "./components/Tree/Tree";

function App() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid>
          <Tree />
        </Grid>
        <Grid size="grow">bbb</Grid>
      </Grid>
      <FolderPicker />
      <Settings />
      <FileNodeEdit />
    </>
  );
}

export default App;
