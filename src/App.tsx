import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import { TierToggles } from "./components/TierToggles/TierToggles";
import { ItemEditor } from "./components/ItemEditor/ItemEditor";
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
import { ModelView } from "./components/ModelView/ModelView";
import { ImageView } from "./components/ImageView/ImageView";

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
