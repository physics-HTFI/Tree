import { useEffect, useState } from "react";
import {
  loadLastUsedFolderAsync,
  saveLastUsedFolderAsync,
} from "./lastUsedFolder";
import { pickLocalFolder } from "./pickLocalFolder";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

type Props = {
  open: boolean;
  onSelect: (handle: FileSystemDirectoryHandle) => void;
};

export function FolderPicker({ open, onSelect }: Props) {
  // マウント時に、前回使用されたフォルダをIndexedDBから読み込む
  const [lastUsed, setLastUsed] = useState<FileSystemDirectoryHandle | null>(
    null,
  );
  useEffect(() => {
    (async () => {
      setLastUsed(await loadLastUsedFolderAsync());
    })();
  }, []);

  const handleSelect = async (handle: FileSystemDirectoryHandle | null) => {
    if (!handle) return;
    onSelect(handle);
    await saveLastUsedFolderAsync(handle);
  };

  const pickFolder = async () => await handleSelect(await pickLocalFolder());
  const pickLastUsed = async () => await handleSelect(lastUsed);

  if (!open) return null;
  return (
    <Dialog open={open}>
      <DialogTitle>フォルダーを選択してください</DialogTitle>
      <DialogContent>
        <Button onClick={pickFolder} variant="contained">
          選択
        </Button>
        <h2 className="text-lg font-semibold my-4">前回使用されたフォルダー</h2>
        {lastUsed ? (
          <Button onClick={pickLastUsed} sx={{ textTransform: "none" }}>
            {lastUsed.name}
          </Button>
        ) : (
          "なし"
        )}
      </DialogContent>
    </Dialog>
  );
}
