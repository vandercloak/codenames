import words from "../assets/words";
import uuid from "react-uuid";
import {
  GameState,
  TeamColor,
  GameStatus,
  Cards,
  Teams,
  Winner
} from "../types/game";

export const createGame = () => {
  const first = Math.random() >= 0.5 ? "blue" : "red";
  const { selected: cards } = getRandom(words, 25);
  const { selected: red, unselected } = getRandom(
    cards,
    first === "red" ? 9 : 8
  );
  const { selected: blue, unselected: unselected2 } = getRandom(
    unselected,
    first === "blue" ? 9 : 8
  );
  const { selected: black, unselected: yellow } = getRandom(unselected2, 1);

  let gameState = {
    winner: "" as Winner,
    cards: {} as Cards,
    teams: { red, blue, black, yellow } as Teams,
    turn: first,
    spymasters: { red: "", blue: "" }
  } as GameState;

  cards.forEach((word: string) => {
    gameState.cards[word] = {
      clicked: false,
      color: getCardColor(word),
      id: uuid()
    };
  });

  function getCardColor(word: string): TeamColor {
    if (black.includes(word)) return "black" as TeamColor;
    if (red.includes(word)) return "red" as TeamColor;
    if (blue.includes(word)) return "blue" as TeamColor;
    return "yellow" as TeamColor;
  }

  return gameState;
};

const getRandom = (arr: any[], n: number) => {
  const pool = [...arr];
  const returnArr = [];

  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    returnArr.push(pool.splice(idx, 1)[0]);
  }

  return { selected: returnArr, unselected: pool };
};

export const getGameStatus = (gameState?: GameState) => {
  if (!gameState) {
    return {} as GameStatus;
  }
  const status = {
    teamStatus: {
      red: gameState.teams.red.length,
      blue: gameState.teams.blue.length,
      black: gameState.teams.black.length,
      yellow: gameState.teams.yellow.length
    } as { [key in TeamColor]: number },
    winner: "",
    cardsRevealed: 0
  } as GameStatus;

  const cards = gameState.cards;

  Object.keys(cards).forEach(card => {
    const cardState = cards[card];
    if (cardState.clicked) {
      status.teamStatus[cardState.color]--;
      status.cardsRevealed++;
    }
  });

  if (status.teamStatus["red"] === 0) {
    status.winner = "red";
  }

  if (status.teamStatus["blue"] === 0) {
    status.winner = "blue";
  }

  if (status.teamStatus["black"] === 0) {
    status.winner = otherTeam(gameState.turn);
  }

  return status;
};

export const otherTeam = (team: "red" | "blue") => {
  return team === "red" ? "blue" : "red";
};
