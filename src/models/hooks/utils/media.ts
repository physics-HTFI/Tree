import {
  readMp3Async,
  readSvgAsync,
  readSvgFromFileAsync,
  saveSvgAsync,
} from "./media/base64";
import { renameSvgFileAsync } from "./media/moveSvg";

export const media = {
  base64: {
    readMp3Async,

    readSvgFromFileAsync,
    readSvgAsync,
    saveSvgAsync,
  },

  renameSvgFileAsync,
};
