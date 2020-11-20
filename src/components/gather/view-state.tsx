import { atom } from "recoil";

export const screenState = atom<"tile" | "full">({
  default: "tile",
  key: "screenState",
});
