import { atom } from "jotai";
import { _atomDefaultSvgBase64 } from "./backings/_atomDefaultSvgBase64";

export const atomDefaultSvgBase64Value = atom((get) =>
  get(_atomDefaultSvgBase64),
);
