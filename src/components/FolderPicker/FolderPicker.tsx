import { pickLocalFolder } from "./pickLocalFolder";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useLastUsed } from "./useLastUsed";

type Props = {
  open: boolean;
  onSelect: (handle: FileSystemDirectoryHandle) => void;
};

export function FolderPicker({ open, onSelect }: Props) {
  const { lastUsedFolder, handleSelectAsync } = useLastUsed(onSelect);

  const pickFolder = async () =>
    await handleSelectAsync(await pickLocalFolder());

  const pickLastUsed = async () => await handleSelectAsync(lastUsedFolder);

  if (!open) return null;
  return (
    <Dialog open={open}>
      <DialogTitle>読み込むフォルダーを選択してください</DialogTitle>
      <DialogContent>
        <Button
          onClick={pickFolder}
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
            onClick={pickLastUsed}
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
