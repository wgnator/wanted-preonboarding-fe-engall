import styled from "styled-components";
import logo from "../images/logo.png";
import { theme } from "../styles/theme";
import TimeZoneSelector from "./TimeZoneSelector";

export default function Header() {
  return (
    <Container>
      <Img src={logo} alt="EngAll" />
      <TimeZoneSelector />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 3rem;
  padding: 0.2rem 2rem;
  background-color: ${theme.headerBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Img = styled.img`
  height: 80%;
  position: relative;
  top: 0.2rem;
`;
