import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { theme } from "../styles/theme";
import { timeZoneNames } from "../consts/timeZoneNames";
import timeZoneReducer, { timeZoneSwitched } from "../reducers/timeZoneReducer";

export default function TimeZoneSelector() {
  const timeZone = useAppSelector((state) => state.timeZone);
  const dispatch = useAppDispatch();
  const [isDropdownShowing, setIsDropdownShowing] = useState(false);
  console.log(timeZone);
  return (
    <Container>
      <CurrentTimeZone onClick={() => setIsDropdownShowing(true)}>Time Zone: {timeZone}</CurrentTimeZone>
      {isDropdownShowing && (
        <DropdownContainer>
          {timeZoneNames.map((timeZoneName) => (
            <TimeZoneItem
              key={timeZoneName}
              onClick={() => {
                dispatch(timeZoneSwitched(timeZoneName));
                setIsDropdownShowing(false);
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
`;

const CurrentTimeZone = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
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
`;

const TimeZoneItem = styled.div`
  cursor: pointer;
  :hover {
    background-color: ${theme.iconBackgroundColor};
  }
`;
