import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { Tiers } from "./components/Tiers/Tiers";
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
      <Tiers />
      <FileNodeEdit />
    </>
  );
}

export default App;
