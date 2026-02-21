import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { ItemEditor } from "./components/ItemEditor/ItemEditor";
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
      <TierToggles />
      <ItemEditor />
    </>
  );
}

export default App;
