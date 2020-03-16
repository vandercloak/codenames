export type PlayerState = {
  red: { [key: string]: Player };
  blue: { [key: string]: Player };
};

export type Player = {
  name: string;
};
