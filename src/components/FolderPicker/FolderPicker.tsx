import { pickLocalFolderAsync } from "../../generics/utils/pickLocalFolder";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useLastUsedFolderHandle } from "../../generics/hooks/useLastUsedFolderHandle/useLastUsedFolderHandle";
import { useFolder } from "../../jotai/useFolder";

export function FolderPicker() {
  // フック
  const { isFolderSelected, setFolderAsync } = useFolder();
  const { lastUsedFolderHandle, saveLastUsedFolderHandleAsync } =
    useLastUsedFolderHandle();

  const selectFolderAsync = async (
    handle: FileSystemDirectoryHandle | null,
  ) => {
    if (!handle) return;
    await setFolderAsync(handle);
    await saveLastUsedFolderHandleAsync(handle);
  };

  // イベントハンドラー
  const pickFolderAsync = async () =>
    await selectFolderAsync(await pickLocalFolderAsync());
  const pickLastUsedAsync = async () =>
    await selectFolderAsync(lastUsedFolderHandle);

  const open = !isFolderSelected;
  return (
    <Dialog open={open}>
      <DialogTitle>読み込むフォルダーを選択してください</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={pickFolderAsync}
            variant="contained"
            sx={{ mr: 2 }}
            className="mr-50"
          >
            フォルダーを
            <br />
            選択する
          </Button>
          {lastUsedFolderHandle && (
            <Button
              onClick={pickLastUsedAsync}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              前回のフォルダー
              <br />
              {lastUsedFolderHandle.name}
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
