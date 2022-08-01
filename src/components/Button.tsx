import styled from "styled-components";
import { theme } from "../styles/theme";

export default function Button({ ...props }) {
  return <Container {...props}></Container>;
}

const Container = styled.button`
  background-color: ${theme.buttonBackgroundColor};
  color: white;
  width: 10rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
