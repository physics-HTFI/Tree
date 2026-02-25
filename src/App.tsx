import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { Box, Stack } from "@mui/material";
import {
  CloseButton,
  EditButton,
  LinkButton,
  ModelEnableButton,
  TickPanelButton,
} from "./components/Buttons";
import { FolderEditor, ItemEditor } from "./components/Editors";
import { ImageView, ModelView, TreeView } from "./components/Views";

function App() {
  return (
    <>
      <FolderPicker />
      <FolderEditor />
      <Stack direction="row" spacing={1}>
        <TreeView />
        <ImageView />
        <Stack
          sx={{
            alignItems: "flex-end",
            maxWidth: 300,
            ml: "auto !important", // 右寄せにする
            p: 1,
            height: "calc(100vh - 16px)",
            position: "sticky", // (1) 位置を固定する
            top: 0, // (1)
          }}
        >
          <TierToggles />
          <ModelView />
          <Box sx={{ mt: "auto" }} />
          <Stack direction="row" sx={{ mb: 1 }}>
            <ModelEnableButton />
            <EditButton />
            <LinkButton />
            <CloseButton />
            <TickPanelButton />
          </Stack>
          <ItemEditor />
        </Stack>
      </Stack>
    </>
  );
}

export default App;
