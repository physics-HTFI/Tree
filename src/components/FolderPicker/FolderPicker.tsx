import { pickLocalFolderAsync } from "./pickLocalFolder";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useLastUsedFolderHandle } from "./useLastUsedFolderHandle";
import { useFolder } from "./_useFolder";

export function FolderPicker() {
  // フック
  const { isFolderSelected, setFolderAsync } = useFolder();
  const { lastUsedFolder, setLastUsedFolderAsync } =
    useLastUsedFolderHandle(setFolderAsync);

  // イベントハンドラー
  const pickFolderAsync = async () =>
    await setLastUsedFolderAsync(await pickLocalFolderAsync());
  const pickLastUsedAsync = async () =>
    await setLastUsedFolderAsync(lastUsedFolder);

  const open = !isFolderSelected;
  return (
    <Dialog open={open}>
      <DialogTitle>読み込むフォルダーを選択してください</DialogTitle>
      <DialogContent>
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
        {lastUsedFolder && (
          <Button
            onClick={pickLastUsedAsync}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            前回のフォルダー
            <br />
            {lastUsedFolder.name}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
