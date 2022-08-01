import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { CLASS_DURATION } from "../consts/config";
import { useScheduleModel } from "../models/useScheduleModel";
import { theme } from "../styles/theme";
import { convertToMinuteOfWeek, DAYS_SEQUENCE, DAYS_TEXT, getArrayOfIntegerBetween } from "../utils/timeCalculations";

type SelectedValuesStateType = {
  time: { hour: string; minute: string; ampm: string };
  daysArray: boolean[];
};

type IsSelectingStateType = {
  hour: boolean;
  minute: boolean;
};

export default function AddSchedulePage() {
  const [selectedValues, setSelectedValues] = useState<SelectedValuesStateType>({ time: { hour: "00", minute: "00", ampm: "am" }, daysArray: Object.keys(DAYS_SEQUENCE).map((_) => false) });
  const [isSelecting, setIsSelecting] = useState<IsSelectingStateType>({ hour: false, minute: false });
  const hoursContainerRef = useRef(null);
  const minutesContainerRef = useRef(null);
  const { saveSlot } = useScheduleModel();
  const navigate = useNavigate();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValues({ ...selectedValues, time: { ...selectedValues.time, [event.target.name]: event.target.value } });
  };

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    setSelectedValues({ ...selectedValues, daysArray: selectedValues.daysArray.map((currentState: boolean, _index: number) => (_index === index ? isChecked : currentState)) });
  };

  const onClickSave = () => {
    const { hour, minute, ampm } = selectedValues.time;
    const selectedDays = selectedValues.daysArray.reduce((acc, isChecked, index) => (isChecked ? [...acc, index] : acc), [] as number[]);

    selectedDays.forEach((dayIndex) => {
      const startTimeInMinute = convertToMinuteOfWeek(dayIndex, hour, minute, ampm);
      saveSlot({ startTime: startTimeInMinute, endTime: startTimeInMinute + CLASS_DURATION })
        .then((_) => {
          window.alert(`Schedule saved: ${DAYS_TEXT[dayIndex]} ${hour}:${minute} ${ampm}`);
          navigate("/");
        })
        .catch((error) => {
          window.alert(
            error.message.includes("schedule_overlap")
              ? `Oops! Your entered schedule time "${DAYS_TEXT[dayIndex]} ${hour}:${minute} ${ampm}" overlaps with saved schedule starting at "${error.message.split("%")[1]}" \n`
              : error.message
          );
        });
    });
  };

  const detectHasClickedOutsidePicker = (event: MouseEvent) => {
    if (!event.composedPath().find((_path) => _path === hoursContainerRef.current) && !event.composedPath().find((_path) => _path === minutesContainerRef.current))
      setIsSelecting({ hour: false, minute: false });
  };

  useEffect(() => {
    document.body.addEventListener("click", detectHasClickedOutsidePicker);
    return () => {
      document.body.removeEventListener("click", detectHasClickedOutsidePicker);
    };
  }, []);

  useEffect(() => {
    setIsSelecting({ hour: false, minute: false });
  }, [selectedValues]);

  return (
    <Container>
      <PageTitle>Add Class Schedule</PageTitle>
      <OptionsContainer>
        <UpperRowWrapper>
          <h4>Start time</h4>
          <SelectionWindow isOpen={isSelecting.hour}>
            <Ul ref={hoursContainerRef}>
              {isSelecting.hour ? (
                HOURS_ARRAY.map((hour) => (
                  <Li key={hour + "h"}>
                    <RadioInput name="hour" id={hour + "h"} key={hour} value={hour} checked={selectedValues.time.hour === hour} onChange={handleRadioChange} />
                    <SelectBox htmlFor={hour + "h"}>{hour}</SelectBox>
                  </Li>
                ))
              ) : (
                <SelectedDisplay
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsSelecting({ hour: true, minute: false });
                  }}
                >
                  {selectedValues.time.hour}
                </SelectedDisplay>
              )}
            </Ul>
          </SelectionWindow>
          <span>:</span>
          <SelectionWindow isOpen={isSelecting.minute}>
            <Ul ref={minutesContainerRef}>
              {isSelecting.minute ? (
                MINUTES_ARRAY.map((minute) => (
                  <Li key={minute + "m"}>
                    <RadioInput name="minute" id={minute + "m"} key={minute} value={minute} checked={selectedValues.time.minute === minute} onChange={handleRadioChange} />
                    <SelectBox htmlFor={minute + "m"}>{minute}</SelectBox>
                  </Li>
                ))
              ) : (
                <SelectedDisplay
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsSelecting({ hour: false, minute: true });
                  }}
                >
                  {selectedValues.time.minute}
                </SelectedDisplay>
              )}
            </Ul>
          </SelectionWindow>
          <AMPMWrapper>
            <RadioInput name="ampm" id="am" value="AM" checked={selectedValues.time.ampm === "AM"} onChange={handleRadioChange} />
            <SelectBox htmlFor="am">AM</SelectBox>
            <RadioInput name="ampm" id="pm" value="PM" checked={selectedValues.time.ampm === "PM"} onChange={handleRadioChange} />
            <SelectBox htmlFor="pm">PM</SelectBox>
          </AMPMWrapper>
        </UpperRowWrapper>
        <LowerRowWrapper>
          <h4>Repeat on</h4>
          {Object.keys(DAYS_SEQUENCE).map((day, index) => (
            <div key={day}>
              <CheckboxInput
                id={day}
                name="days"
                value={day}
                checked={selectedValues.daysArray[index]}
                onChange={(event) => {
                  handleCheckboxChange(index, event.target.checked);
                }}
              />
              <SelectBox htmlFor={day}> {day}</SelectBox>
            </div>
          ))}
        </LowerRowWrapper>
        <Button
          style={{ position: "absolute", bottom: "1rem", right: "13rem" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Back To View Schedule
        </Button>
        <Button style={{ position: "absolute", bottom: "1rem", right: "1rem" }} onClick={onClickSave}>
          Save
        </Button>
      </OptionsContainer>
    </Container>
  );
}

const HOURS_ARRAY = getArrayOfIntegerBetween(0, 12, "asc");
const MINUTES_ARRAY = getArrayOfIntegerBetween(0, 60, "asc", 5);

const Container = styled.div`
  width: 100%;
  * {
    border-color: ${theme.borderColor};
  }
`;
const OptionsContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 15rem;
  max-height: 30rem;
  padding: 1rem;
  box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  background-color: white;

  justify-content: space-around;
`;

const UpperRowWrapper = styled.div`
  width: 100%;
  height: 8rem;
  display: flex;

  > * {
    margin: 0.5rem;
    width: fit-content;
  }
  * {
    z-index: 1;
  }
`;

const LowerRowWrapper = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  overflow-x: auto;
  > * {
    margin: 0 0.5rem;
    width: 6rem;
  }
`;
const SelectionWindow = styled.div<{ isOpen: boolean }>`
  width: 3rem;
  height: ${(props) => (props.isOpen ? "6rem" : "2rem")};
  padding: 0;
  overflow: hidden;
  ${(props) => (props.isOpen ? `border-top: ${theme.borderColor} 1px solid; border-bottom: ${theme.borderColor} 1px solid;` : "")};
`;

const SelectedDisplay = styled.div`
  width: 3rem;
  height: 100%;
  border: ${theme.borderColor} 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  * {
  }
`;
const Ul = styled.ul`
  width: 131%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Li = styled.li`
  width: 100%;
  height: 2rem;
  background-color: white;
`;
const AMPMWrapper = styled.div`
  display: flex;
  width: 5rem;
  height: 100%;
`;

const SelectBox = styled.label`
  top: 0;
  min-width: 3rem;
  padding: 1rem;
  height: 2rem;
  box-sizing: border-box;
  border: ${theme.borderColor} 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  }
`;

const RadioInput = styled.input.attrs((props) => ({ type: "radio" }))`
  width: 0;
  height: 0;
  margin: 0;
  position: absolute;
  &:checked + label {
    background-color: ${theme.elementSelectedColor};
    color: white;
    border-color: ${theme.elementSelectedColor};
  }
`;

const CheckboxInput = styled.input.attrs((props) => ({ type: "checkbox" }))`
  width: 0;
  height: 0;
  margin: 0;
  position: absolute;
  &:checked + label {
    background-color: ${theme.elementSelectedColor};
    color: white;
    border-color: ${theme.elementSelectedColor};
  }
`;
