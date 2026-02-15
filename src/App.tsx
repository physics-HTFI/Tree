import { useState } from "react";
import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import "./App.css";
import { useSetAtom } from "jotai";
import { atomSetFolder } from "./jotai/atomFolder";
import { Settings } from "./components/Settings/Settings";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const setFolder = useSetAtom(atomSetFolder);
  const handleSelect = async (handle: FileSystemDirectoryHandle) => {
    await setFolder(handle);
    setIsOpen(false);
  };

  return (
    <>
      <FolderPicker open={isOpen} onSelect={handleSelect} />
      <Settings />
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
