import React, { useState, useEffect } from "react";
import { useMutation, useSubscription } from "urql";
import WordList from "../components/word-list";
import {
  Row,
  Col,
  PageHeader,
  Descriptions,
  Typography,
  Tabs,
  List
} from "antd";
import { createGame, getGameStatus, otherTeam } from "../utils/game";
import Board from "../components/board";
import { GameState, TeamColor } from "../types/game";
import JoinTeam from "../components/actions/join-team";
import NewGame from "../components/actions/new-game";
import { getUserId, getPlayer } from "../utils/player";
import { PlayerState } from "../types/player";
import isEqual from "lodash/isEqual";
import capitalize from "lodash/capitalize";
import { background } from "../components/card";
import { GameMenu } from "../components/game-menu";

const { Paragraph } = Typography;
const subscribeToGame = `
  subscription game_by_pk($id: String!) {
    res: game_by_pk(id: $id) {
      gameState
      playerState
    }
  }
`;

const updateState = `
  mutation updateState($id: String!, $gameState: json, $playerState: json) {
    res: update_game(where: {id: {_eq: $id}}, _set: {gameState: $gameState, playerState: $playerState}) {
      returning {
        gameState
        playerState
      }
    }
  }
`;

const Game = ({ id }: { id: string }) => {
  const userId = getUserId();
  const [result] = useSubscription({
    query: subscribeToGame,
    variables: { id }
  });
  const [, update] = useMutation(updateState);
  const { error, data } = result;
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    const gameStateResult = data?.res?.gameState;
    if (gameStateResult && !isEqual(gameStateResult, gameState)) {
      setGameState(gameStateResult);
    }
  }, [data]);

  const updateGameState = (gameState: GameState) => {
    update({ id, gameState, playerState: data?.res.playerState });
  };
  const updatePlayerState = (playerState: PlayerState) => {
    update({ id, gameState, playerState });
  };

  if (error) return <>Oh no!</>;
  if (!gameState || gameState === ({} as any))
    return (
      <Row justify="center" style={{ padding: 20 }}>
        <Col>
          <NewGame update={updateGameState} />
        </Col>
      </Row>
    );
  if (!data?.res?.playerState)
    return (
      <JoinTeam
        userId={userId}
        update={updatePlayerState}
        playerState={data?.res?.playerState}
      />
    );

  const playerState = data?.res?.playerState as PlayerState;
  const { team, isSpymaster } = getPlayer(playerState, gameState);

  if (!team)
    return (
      <JoinTeam
        playerState={data.res.playerState}
        update={updatePlayerState}
        userId={userId}
      />
    );

  const {
    teamStatus: { red, blue }
  } = getGameStatus(gameState);

  return (
    <div>
      <Row justify="center" style={{ padding: 20 }}>
        <Col span={24}>
          <PageHeader
            style={{ paddingLeft: 3, paddingRight: 3 }}
            ghost={false}
            title={
              !gameState.winner ? (
                <>
                  <span
                    style={{
                      color: background[gameState.turn as TeamColor].color
                    }}
                  >
                    {capitalize(gameState.turn)} Teams Turn
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      color: background[gameState.winner as TeamColor].color
                    }}
                  >
                    {capitalize(gameState.turn)} Team Wins 👏👏👏
                  </span>
                </>
              )
            }
            subTitle={
              !gameState.winner && !isSpymaster ? (
                <>
                  You are on team{" "}
                  <span style={{ color: background[team as TeamColor].color }}>
                    {capitalize(team)}
                  </span>
                </>
              ) : (
                <>
                  😎You are the spymaster for team{" "}
                  <span style={{ color: background[team as TeamColor].color }}>
                    {capitalize(team)}
                  </span>{" "}
                  😎
                </>
              )
            }
            extra={[
              <GameMenu
                gameState={gameState}
                playerState={playerState}
                updateGameState={updateGameState}
                updatePlayerState={updatePlayerState}
              />
            ]}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Red team">
                Needs {red} more
              </Descriptions.Item>
              <Descriptions.Item label="Blue team">
                Needs {blue} more
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </Col>
        <Col span={24}>
          {isSpymaster ? (
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Board" key="1">
                <Board
                  gameState={gameState}
                  playerState={playerState}
                  team={team}
                  update={updateGameState}
                  winner={gameState?.winner || ""}
                  id={id}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Word List" key="2">
                <WordList
                  red={gameState.teams.red}
                  blue={gameState.teams.blue}
                  spy={gameState.teams.black}
                />
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <Board
              gameState={gameState}
              playerState={playerState}
              team={team}
              update={updateGameState}
              winner={gameState?.winner || ""}
              id={id}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Game;
