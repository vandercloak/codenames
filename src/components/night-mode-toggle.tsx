import React from "react";
import styled from "styled-components";
import { useThemes } from "../hooks/use-themes";

const Toggle = () => {
  const { theme, toggleTheme } = useThemes();

  return (
    <ToggleContainer theme={theme} onClick={toggleTheme}>
      <img
        src="https://image.flaticon.com/icons/svg/1164/1164954.svg"
        width="224"
        height="224"
        alt="Sun free icon"
        title="Sun free icon"
      />
      <img
        src="https://image.flaticon.com/icons/svg/2033/2033921.svg"
        width="224"
        height="224"
        alt="Moon free icon"
        title="Moon free icon"
      />
    </ToggleContainer>
  );
};

const ToggleContainer = styled.button`
  position: relative;
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.gradient};
  width: 6rem;
  height: 2.7rem;
  outline: none;
  margin: 0 auto;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  font-size: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  cursor: pointer;

  img {
    max-width: 2rem;
    height: auto;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${({ theme }) =>
        theme.key === "light" ? "translateY(-4px)" : "translateY(100px)"};
    }

    &:nth-child(2) {
      transform: ${({ theme }) =>
        theme.key === "light" ? "translateY(-100px)" : "translateY(-4px)"};
    }
  }
`;

export default Toggle;
