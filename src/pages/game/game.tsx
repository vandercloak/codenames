import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useMutation, useSubscription } from "urql";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import WordList from "../../components/word-list";
import "./game.scss";
import {
  Row,
  Col,
  PageHeader,
  Descriptions,
  Typography,
  Tabs,
  List,
  Button,
} from "antd";
import { getGameStatus } from "../../utils/game";
import Board from "../../components/board";
import { GameState } from "../../types/game";
import NewGame from "../../components/actions/new-game";
import { getUserId } from "../../utils/player";
import isEqual from "lodash/isEqual";
import { GameMenu } from "../../components/game-menu";
import { useThemes } from "../../hooks/use-themes";
import { teamCards } from "../../components/card";
import Gather from "../../components/gather/gather";

const subscribeToGame = `
  subscription game_by_pk($id: String!) {
    res: game_by_pk(id: $id) {
      gameState
    }
  }
`;

const updateState = `
  mutation updateState($id: String!, $gameState: json) {
    res: update_game(where: {id: {_eq: $id}}, _set: {gameState: $gameState}) {
      returning {
        gameState
      }
    }
  }
`;

const Game = () => {
  const {
    path,
    params: { id },
  } = useRouteMatch<{ id: string }>();
  console.log(path);
  const { theme, darkMode } = useThemes();
  const [timer, setTimer] = useState(120000);
  const userId = getUserId();
  const [result] = useSubscription({
    query: subscribeToGame,
    variables: { id },
  });
  const [, update] = useMutation(updateState);
  const [isSpymaster, setIsSpymaster] = useState(false);
  const { error, data, fetching } = result;
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    const gameStateResult = data?.res?.gameState;
    if (gameStateResult && !isEqual(gameStateResult, gameState)) {
      setGameState(gameStateResult);
    }
  }, [data]);

  const updateGameState = (gameState: GameState) => {
    update({ id, gameState });
  };

  if (error) return <>Oh no!</>;
  if (!gameState && !fetching)
    return (
      <Row justify="center" style={{ padding: 20 }}>
        <Col>
          <NewGame update={updateGameState} />
        </Col>
      </Row>
    );
  if (!gameState) return null;

  const {
    teamStatus: { red, blue },
  } = getGameStatus(gameState);

  return (
    <Switch>
      <Route exact path={`${path}/spymaster`}>
        <WordList
          red={gameState.teams.red}
          blue={gameState.teams.blue}
          spy={gameState.teams.black}
        />
      </Route>
      <Route exact path={`${path}`}>
        <Row
          style={{
            height: "100vh",
            overflowY: "hidden",
            paddingBottom: 0,
            backgroundColor: theme.backgroundColor,
          }}
        >
          <Col md={20}>
            <div
              className={theme.classOverride}
              style={{ maxWidth: 1000, margin: "auto" }}
            >
              <Row justify="center" style={{ padding: "40px 20px" }}>
                <Col span={24}>
                  <PageHeader
                    style={{
                      paddingLeft: 3,
                      paddingRight: 3,
                      backgroundColor: theme.backgroundColor,
                    }}
                    ghost={false}
                    title={
                      <>
                        <span
                          style={{
                            color:
                              theme.key === "light"
                                ? teamCards["blue"].color
                                : teamCards["red"].color,
                          }}
                        >
                          Game
                        </span>{" "}
                        <span
                          style={{
                            color:
                              theme.key === "light"
                                ? teamCards["red"].color
                                : teamCards["blue"].color,
                          }}
                        >
                          Time!
                        </span>
                      </>
                    }
                    extra={[
                      <GameMenu
                        isSpymaster={isSpymaster}
                        setIsSpymaster={setIsSpymaster}
                        gameState={gameState}
                        updateGameState={updateGameState}
                      />,
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
                    {/* <div>
                <Timer initialTime={timer} direction="backward">
                  {({ reset }: any) => (
                    <>
                      <Button onClick={() => reset()}>Reset</Button>
                      {"  "}
                      <React.Fragment>
                        <Timer.Minutes /> minutes <Timer.Seconds /> seconds
                      </React.Fragment>
                    </>
                  )}
                </Timer>
              </div> */}
                  </PageHeader>
                </Col>
                <Col span={24}>
                  {isSpymaster ? (
                    <Tabs defaultActiveKey="1">
                      <Tabs.TabPane tab="Board" key="1">
                        <Board
                          isSpymaster
                          gameState={gameState}
                          update={updateGameState}
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
                    <Board gameState={gameState!} update={updateGameState} />
                  )}
                </Col>
              </Row>
            </div>
          </Col>
          <Col
            md={4}
            style={{
              height: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            <Gather />
          </Col>
        </Row>
      </Route>
    </Switch>
  );
};

export default Game;
