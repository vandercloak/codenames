import React from "react";
import { Row, Col, Typography } from "antd";
import { teamCards } from "./card";
import { GameState } from "../types/game";

const { Title, Text } = Typography;

const WordList = ({
  gameState,
  red,
  blue,
  spy,
}: {
  gameState: GameState;
  red: string[];
  blue: string[];
  spy: string[];
}) => {
  const redColor = teamCards["red"].color;
  const blueColor = teamCards["blue"].color;
  const blackColor = teamCards["black"].color;

  return (
    <Row
      justify="center"
      style={{ maxWidth: 450, margin: "auto", padding: 50 }}
      className="word-list"
    >
      <Title level={3} style={{ marginBottom: 40 }}>
        You are a Spymaster 😎
      </Title>
      <Col span={8}>
        <Title level={4} style={{ color: redColor }}>
          Red
        </Title>
        {red.map((word: string) => {
          const crossed = gameState.cards[word].clicked;
          return (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: redColor,
                  textDecoration: crossed ? "line-through" : "",
                }}
              >
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4} style={{ color: blueColor }}>
          Blue
        </Title>
        {blue.map((word: string) => {
          const crossed = gameState.cards[word].clicked;

          return (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: blueColor,
                  textDecoration: crossed ? "line-through" : "",
                }}
              >
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title
          level={4}
          style={{
            color: blackColor,
          }}
        >
          Spy
        </Title>
        <Text style={{ fontSize: 16, color: blackColor }}>{spy}</Text>
      </Col>
    </Row>
  );
};

export default WordList;
