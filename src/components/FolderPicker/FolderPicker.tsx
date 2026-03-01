import { pickLocalFolderAsync } from "@/generics/utils/pickLocalFolder";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useLastUsedFolderHandle } from "@/generics/hooks/useLastUsedFolderHandle/useLastUsedFolderHandle";
import { atomsFolders } from "@/jotai/atomFolders";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

export function FolderPicker() {
  // フック
  const isSelected = useAtomValue(atomsFolders.isSelectedValue);
  const setFoldersAsync = useSetAtom(atomsFolders.setAsync);
  const {
    lastUsedFolderHandle: lastUsedDataFolder,
    saveLastUsedFolderHandleAsync: saveLastUsedDataFolderAsync,
  } = useLastUsedFolderHandle("data");
  const {
    lastUsedFolderHandle: lastUsedReferenceFolder,
    saveLastUsedFolderHandleAsync: saveLastUsedReferenceFolderAsync,
  } = useLastUsedFolderHandle("reference");
  const [folders, setFolders] = useState<{
    data?: FileSystemDirectoryHandle;
    reference?: FileSystemDirectoryHandle;
  }>({});

  const hasLastUsed = !!lastUsedDataFolder && !!lastUsedReferenceFolder;

  const selectFolderAsync = async (newFolders: typeof folders) => {
    setFolders(newFolders);
    if (!newFolders.data || !newFolders.reference) return;
    const unpacked = { data: newFolders.data, reference: newFolders.reference }; // selectedを直接渡すと型エラーになるため、unpackedに一旦格納する
    await setFoldersAsync(unpacked);
    await saveLastUsedDataFolderAsync(unpacked.data);
    await saveLastUsedReferenceFolderAsync(unpacked.reference);
  };

  // イベントハンドラー
  const pickFolderAsync = async (type: "data" | "reference") => {
    const folder = await pickLocalFolderAsync(
      type === "data" ? "readwrite" : "read",
    );
    const newFolders = { ...folders, [type]: folder };
    await selectFolderAsync(newFolders);
  };
  const pickLastUsedAsync = async () => {
    if (!hasLastUsed) return;
    const newFolders = {
      data: lastUsedDataFolder ?? undefined,
      reference: lastUsedReferenceFolder ?? undefined,
    };
    await selectFolderAsync(newFolders);
  };

  const open = !isSelected;
  return (
    <Dialog open={open}>
      <DialogTitle>フォルダーを選択してください</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={() => pickFolderAsync("data")}
            variant="contained"
            sx={{ mr: 2, textTransform: "none" }}
            className="mr-50"
          >
            データフォルダー
            <br />
            {folders.data?.name ?? "- 未選択 -"}
          </Button>
          <Button
            onClick={() => pickFolderAsync("reference")}
            variant="contained"
            sx={{ mr: 2, textTransform: "none" }}
            className="mr-50"
          >
            参照フォルダー
            <br />
            {folders.reference?.name ?? "- 未選択 -"}
          </Button>
          {hasLastUsed && (
            <Button
              onClick={pickLastUsedAsync}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              前回のフォルダー
              <br />
              {lastUsedDataFolder.name}
              {" -- "}
              {lastUsedReferenceFolder.name}
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
