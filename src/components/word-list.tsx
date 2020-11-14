import React from "react";
import { Row, Col, Typography } from "antd";
import { teamCards } from "./card";

const { Title, Text } = Typography;

const WordList = ({
  red,
  blue,
  spy,
}: {
  red: string[];
  blue: string[];
  spy: string[];
}) => {
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
        <Title level={4} style={{ color: teamCards["red"].color }}>
          Red
        </Title>
        {red.map((word: string) => {
          return (
            <>
              <Text style={{ fontSize: 16, color: teamCards["red"].color }}>
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4} style={{ color: teamCards["blue"].color }}>
          Blue
        </Title>
        {blue.map((word: string) => {
          return (
            <>
              <Text style={{ fontSize: 16, color: teamCards["blue"].color }}>
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4} style={{ color: teamCards["black"].color }}>
          Spy
        </Title>
        <Text style={{ fontSize: 16, color: teamCards["black"].color }}>
          {spy}
        </Text>
      </Col>
    </Row>
  );
};

export default WordList;
