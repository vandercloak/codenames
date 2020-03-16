import uuid from "react-uuid";
import { PlayerState } from "../types/player";
import { TeamColor, GameState } from "../types/game";

export const getUserId = () => {
  let userId = localStorage.getItem("codenames-user-id");

  if (!userId) {
    userId = uuid();
    localStorage.setItem("codenames-user-id", userId!);
  }

  return userId!;
};

export const getPlayer = (playerState: PlayerState, gameState: GameState) => {
  const userId = localStorage.getItem("codenames-user-id");
  const nullPlayer = { team: "", name: "", id: "", isSpymaster: false };

  if (!userId) {
    return nullPlayer;
  }
  const { red, blue } = playerState;
  const onTeamRed = !!red[userId];
  const onTeamBlue = !!blue[userId];

  if (!!red[userId]) {
    return {
      name: red[userId].name,
      team: "red",
      id: userId,
      isSpymaster: gameState.spymasters["red"] === userId
    };
  }
  if (!!blue[userId]) {
    return {
      name: blue[userId].name,
      team: "blue",
      id: userId,
      isSpymaster: gameState.spymasters["blue"] === userId
    };
  }

  return nullPlayer;
};
