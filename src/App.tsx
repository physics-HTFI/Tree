import { useState } from "react";
import { FolderPicker } from "./components/FolderPicker/FolderPicker";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <FolderPicker open={isOpen} onSelect={() => setIsOpen(false)} />
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
