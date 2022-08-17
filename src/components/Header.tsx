import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch } from "../hooks/reduxHooks";
import logo from "../images/logo.png";
import { loggedOut } from "../reducers/loginReducer";
import { theme } from "../styles/theme";
import TimeZoneSelector from "./TimeZoneSelector";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef, useState } from "react";

import useDetectOutsideClick from "../utils/useDetectOutsideClick";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isHamburgerOpened, setIsHamburgerOpened] = useState(false);
  const hamburgerRef = useRef(null);
  const functionalComponentsRef = useRef(null);

  useDetectOutsideClick([hamburgerRef, functionalComponentsRef], () => setIsHamburgerOpened(false));

  return (
    <Container>
      <Img src={logo} alt="EngAll" onClick={() => navigate("/")} />
      <HamburgerWrapper ref={hamburgerRef} isOpened={isHamburgerOpened} onClick={() => setIsHamburgerOpened(!isHamburgerOpened)}>
        <GiHamburgerMenu />
      </HamburgerWrapper>
      <FunctionalComponents ref={functionalComponentsRef}>
        <TimeZoneSelector />
        <LogoutButton onClick={() => dispatch(loggedOut())}>Logout</LogoutButton>
      </FunctionalComponents>
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
  @media (max-width: 720px) {
    position: relative;
    padding: 0.2rem 1rem;
  }
`;

const Img = styled.img`
  height: 80%;
  position: relative;
  top: 0.2rem;
`;

const FunctionalComponents = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  > * {
    color: white;
    border: 2px solid white;
  }
  @media (max-width: 720px) {
    z-index: 5;
    display: none;
    flex-direction: column;
    background-color: ${theme.headerBackgroundColor};
    opacity: 0.9;
    position: absolute;
    top: 100%;
    right: 0;
    height: fit-content;
    * {
      width: 100%;
      border: none;
    }
    > *:first-child {
      border-bottom: 1px solid white !important;
    }
  }
`;
const LogoutButton = styled.div`
  padding: 1rem;
  height: 80%;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
`;

const HamburgerWrapper = styled.div<{ isOpened: boolean }>`
  color: white;
  display: none;
  height: 100%;
  width: 5vw;

  justify-content: center;
  align-items: center;
  > * {
    transform: scale(150%);
    transform-origin: center;
  }
  @media (max-width: 720px) {
    display: flex;
  }
  ${(props) =>
    props.isOpened &&
    `
  + div {
    display: flex
    }
  `}
`;
