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
import { Image } from "./components/Image/Image";

function App() {
  return (
    <>
      <FolderPicker />
      <FolderEditor />
      <Grid container spacing={2}>
        <Grid
          sx={{
            p: 1,
            position: "sticky", // (1) スクロールしても常に表示する
            top: 0, // (1)
            alignSelf: "flex-start", // (1)
            overflow: "auto", // (2) アイテムが多い場合にスクロール可能にする
            maxHeight: "100vh", // (2)
          }}
        >
          <TreeView />
        </Grid>
        <Grid size="grow">
          <Image />
        </Grid>
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
        <Stack direction="row" sx={{ mb: 2 }}>
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
