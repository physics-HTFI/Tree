import { ButtonBase } from "../ui/ButtonBase";
import { useEffect, useRef, useState } from "react";
import { atomsSelected } from "@/models/hooks/atomSelected";
import { useAtom, useAtomValue } from "jotai";
import { atomConsts } from "@/models/hooks/atomConsts";

// ref
// [Embed mode](https://www.drawio.com/doc/faq/embed-mode)
// [drawio-integration](https://github.com/jgraph/drawio-integration/tree/main)

const SRC =
  "https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&proto=json&noSaveBtn=1";

export function EditImageButton() {
  const selectedItem = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const [svg, setSvgAsync] = useAtom(atomsSelected.svgBase64);
  const [open, setOpen] = useState(false);
  const defaultSvg = useAtomValue(atomConsts.defaultSvgBase64Value);
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const contentWindow = ref.current?.contentWindow;
    if (!open || !contentWindow) return;
    const receive = async (evt: MessageEvent) => {
      if (evt.data.length === 0) return;
      const msg = JSON.parse(evt.data);
      if (msg.event == "init") {
        contentWindow.postMessage(
          JSON.stringify({ action: "load", xml: svg ?? defaultSvg ?? "" }),
          "*",
        );
      } else if (msg.event == "export") {
        await setSvgAsync(msg.data);
        setOpen(false);
      } else if (msg.event == "save") {
        contentWindow.postMessage(
          JSON.stringify({
            action: "export",
            format: "xmlsvg",
            xml: msg.xml,
            spin: "Updating page",
          }),
          "*",
        );
      } else if (msg.event == "exit") {
        setOpen(false);
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open, svg, setSvgAsync, defaultSvg]);

  if (!selectedItem || selectedItem.isReference) return null;
  return (
    <>
      <ButtonBase type="edit" onClick={() => setOpen(true)} />
      {open && (
        <iframe
          src={SRC}
          ref={ref}
          style={{
            border: 0,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
}
