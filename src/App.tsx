import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierSettings } from "./components/TierSettings/TierSettings";
import { FileSettings } from "./components/FileSettings/FileSettings";
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
      <TierSettings />
      <FileSettings />
    </>
  );
}

export default App;
