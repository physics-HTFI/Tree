import { useAtomValue, useSetAtom } from "jotai";
import { atomFolder } from "./share/atomFolder";

export const useFolder = () => {
  const setFolderAsync = useSetAtom(atomFolder.atomSetFolder);
  const isFolderSelectedValue = useAtomValue(
    atomFolder.atomIsFolderSelectedValue,
  );
  return { isFolderSelectedValue, setFolderAsync };
};
