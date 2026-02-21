import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { ItemEditor } from "./components/ItemEditor/ItemEditor";
import Grid from "@mui/material/Grid";
import { TreeView } from "./components/TreeView/TreeView";

function App() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid>
          <TreeView />
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
