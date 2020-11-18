export interface GameState {
  timerEnd?: string;
  teams: Teams;
  winner: Winner;
  cards: Cards;
  turn: "red" | "blue";
  spymasters: {
    red: string;
    blue: string;
  };
}

export type Winner = TeamColor | "";
export type Cards = { [key: string]: CardState };
export type Teams = { [key in TeamColor]: string[] };

export interface CardState {
  color: TeamColor;
  clicked: boolean;
  id: string;
}

export type TeamColor = "black" | "blue" | "red" | "yellow";

export type GameStatus = {
  teamStatus: { [key in TeamColor]: number };
  winner: TeamColor | "";
  cardsRevealed: number;
};
