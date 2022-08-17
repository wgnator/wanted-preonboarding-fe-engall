import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { theme } from "../styles/theme";
import { timeZoneNames } from "../consts/timeZoneNames";
import { timeZoneSwitched } from "../reducers/timeZoneReducer";
import { useLocation } from "react-router-dom";
import useDetectOutsideClick from "../utils/useDetectOutsideClick";

export default function TimeZoneSelector() {
  const [isSelecting, setIsSelecting] = useState(false);
  const dropdownContainerRef = useRef(null);
  const timeZone = useAppSelector((state) => state.timeZone);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useDetectOutsideClick([dropdownContainerRef], () => setIsSelecting(false));

  useEffect(() => {
    setIsSelecting(false);
  }, [timeZone]);

  return (
    <Container onClick={() => setIsSelecting(true)} ref={dropdownContainerRef}>
      <CurrentTimeZone>Time Zone: {timeZone}</CurrentTimeZone>
      {isSelecting && pathname !== "/add_schedule" && (
        <DropdownContainer>
          {timeZoneNames.map((timeZoneName: string) => (
            <TimeZoneItem
              key={timeZoneName}
              onClick={() => {
                dispatch(timeZoneSwitched(timeZoneName));
                setIsSelecting(false);
              }}
            >
              {timeZoneName}
            </TimeZoneItem>
          ))}
        </DropdownContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: fit-content;
  padding: 1rem;
  height: 80%;
  position: relative;
  border: 2px solid white;
  cursor: pointer;
`;

const CurrentTimeZone = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const DropdownContainer = styled.ul`
  width: fit-content;
  height: 20rem;
  position: absolute;
  top: 110%;
  right: 0;
  border: ${theme.borderColor} 1px solid;
  background-color: rgb(255, 255, 255);
  overflow-y: scroll;
  z-index: 10;
  @media (max-width: 720px) {
    top: 0;
    right: 0;
    width: 100vw;
    height: 90vh;
    transition: all 0.5s;
    animation: slideFromTop 0.5s forwards;
  }
  @keyframes slideFromTop {
    0% {
      top: -100%;
    }
    100% {
      top: 0%;
    }
  }
`;

const TimeZoneItem = styled.div`
  cursor: pointer;
  :hover {
    background-color: ${theme.iconBackgroundColor};
  }
`;
