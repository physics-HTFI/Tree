import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { ItemEditor } from "./components/ItemEditor/ItemEditor";
import Grid from "@mui/material/Grid";
import { TreeView } from "./components/TreeView/TreeView";
import { TickPanelButton } from "./components/TickPanelButton/TickPanelButton";
import { Box, Stack } from "@mui/material";
import { LinkButton } from "./components/LinkButton/LinkButton";
import { EditButton } from "./components/EditButton/EditButton";
import { CloseButton } from "./components/CloseButton/CloseButton";

function App() {
  return (
    <>
      <FolderPicker />
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
        }}
      >
        <TierToggles />
        <Box sx={{ mt: "auto" }} />
        <Stack direction="row" sx={{ my: 2 }}>
          <EditButton />
          <LinkButton />
          <TickPanelButton />
          <CloseButton />
        </Stack>
        <ItemEditor />
      </Stack>
    </>
  );
}

export default App;
