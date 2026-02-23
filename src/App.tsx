import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { ItemEditor } from "./components/ItemEditor/ItemEditor";
import Grid from "@mui/material/Grid";
import { TreeView } from "./components/TreeView/TreeView";
import { Box, Stack } from "@mui/material";
import {
  CloseButton,
  EditButton,
  LinkButton,
  ModelEnableButton,
  TickPanelButton,
} from "./components/Buttons";
import { FolderEditor } from "./components/FolderEditor/FolderEditor";
import { Model } from "./components/Model/Model";

function App() {
  return (
    <>
      <FolderPicker />
      <FolderEditor />
      <Grid container spacing={2}>
        <Grid>
          <TreeView />
        </Grid>
        <Grid size="grow">bbb</Grid>
      </Grid>
      <Stack
        sx={{
          position: "fixed",
          alignItems: "flex-end",
          top: 8,
          bottom: 8,
          right: 8,
          maxWidth: 300,
        }}
      >
        <TierToggles />
        <Model />
        <Box sx={{ mt: "auto" }} />
        <Stack direction="row" sx={{ my: 2 }}>
          <ModelEnableButton />
          <EditButton />
          <LinkButton />
          <CloseButton />
          <TickPanelButton />
        </Stack>
        <ItemEditor />
      </Stack>
    </>
  );
}

export default App;
