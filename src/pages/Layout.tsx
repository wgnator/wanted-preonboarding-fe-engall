import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";
import Header from "../components/Header";

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
  height: 100%;
`;

const Main = styled.div`
  width: 100%;
  height: calc(100% - 3rem);
  padding: 0 2rem;
  background-color: ${theme.pageBackgroundColor};
  @media (max-width: 720px) {
    height: fit-content;
  }
`;
