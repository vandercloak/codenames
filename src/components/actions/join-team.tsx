import React, { useState } from "react";
import { Row, Col, Button, Input } from "antd";
import { PlayerState } from "../../types/player";

const JoinTeam = ({
  update,
  userId,
  playerState
}: {
  update: any;
  userId: string;
  playerState?: PlayerState;
}) => {
  const [team, setTeam] = useState<"red" | "blue" | "">("");
  const [newPlayerState, setNewPlayerState] = useState({});
  const [nickName, setNickName] = useState("");

  const join = (team: "red" | "blue") => {
    setTeam(team);
    // setNewPlayerState(newPlayerState);
    // update(newPlayerState);
  };
  const submit = () => {
    let newPlayerState = playerState as {
      [key in "red" | "blue"]: any;
    };

    if (!newPlayerState) {
      newPlayerState = {
        red: {},
        blue: {}
      };
    }
    newPlayerState[team as "red" | "blue"][userId] = {
      name: nickName
    };

    update(newPlayerState);
  };
  return (
    <>
      {!team && (
        <Row justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            You have not joined a team
          </Col>
          <Col>
            <Button onClick={() => join("red")}>Join Red Team</Button>
            <Button onClick={() => join("blue")}>Join Blue Team</Button>
          </Col>
        </Row>
      )}
      {team && (
        <Row justify="center">
          <Input
            placeholder="Enter nickname"
            value={nickName}
            onChange={e => setNickName(e.target.value)}
          ></Input>
          <Button onClick={submit}>Submit</Button>
        </Row>
      )}
    </>
  );
};

export default JoinTeam;
