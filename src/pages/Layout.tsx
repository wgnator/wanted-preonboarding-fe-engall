import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";
import Header from "../components/Header";
import LoginPage from "./LoginPage";

export function Layout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Main = styled.div`
  width: 100%;
  padding: 0 2rem;
  background-color: ${theme.pageBackgroundColor};
`;
