import React from "react";
import Game from "./pages/game";

export const routes = {
  "/": () => <>Homepage</>,
  "/game/:id": ({ id }: any) => <Game id={id} />
};
