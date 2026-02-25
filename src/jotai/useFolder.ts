import { useAtom } from "jotai";
import { atomFolder } from "./share/atomFolder";

export const useFolder = () => {
  const [folder, setFolderAsync] = useAtom(atomFolder);
  return { isFolderSelected: !!folder, setFolderAsync };
};
