import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useScheduleModel } from "../models/useScheduleModel";
import { theme } from "../styles/theme";
import { DAYS_SEQUENCE, getArrayOfIntegerBetween } from "../utils/timeCalculations";
import { hasClickedOutsideElement } from "../utils/UIFunctions";

export type SelectedTimeType = { hour: string; minute: string; AMPM: "AM" | "PM" };

type SelectedValuesStateType = {
  time: SelectedTimeType;
  daysArray: boolean[];
};

type IsSelectingStateType = {
  hour: boolean;
  minute: boolean;
};

const initialSelectedValues: SelectedValuesStateType = {
  time: { hour: "00", minute: "00", AMPM: "AM" },
  daysArray: Object.keys(DAYS_SEQUENCE).map((_) => false),
};

export default function AddSchedulePage() {
  const [selectedValues, setSelectedValues] = useState<SelectedValuesStateType>(initialSelectedValues);
  const [isSelecting, setIsSelecting] = useState<IsSelectingStateType>({ hour: false, minute: false });
  const hoursContainerRef = useRef<HTMLUListElement>(null);
  const minutesContainerRef = useRef<HTMLUListElement>(null);
  const { processAndSaveSchedule } = useScheduleModel();
  const navigate = useNavigate();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValues({ ...selectedValues, time: { ...selectedValues.time, [event.target.name]: event.target.value } });
  };

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    setSelectedValues({ ...selectedValues, daysArray: selectedValues.daysArray.map((currentState: boolean, _index: number) => (_index === index ? isChecked : currentState)) });
  };

  const onClickSave = async () => {
    const selectedDayIndexes = selectedValues.daysArray.reduce((acc, isChecked, index) => (isChecked ? [...acc, index] : acc), [] as number[]);
    await processAndSaveSchedule(selectedValues.time, selectedDayIndexes);
    navigate("/");
  };

  const clickedOutsideElementListener = (event: MouseEvent) => {
    if (hasClickedOutsideElement(event, hoursContainerRef.current)) setIsSelecting({ ...isSelecting, hour: false });
    if (hasClickedOutsideElement(event, minutesContainerRef.current)) setIsSelecting({ ...isSelecting, minute: false });
  };

  useEffect(() => {
    document.body.addEventListener("click", clickedOutsideElementListener, false);
    return () => {
      document.body.removeEventListener("click", clickedOutsideElementListener, false);
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
          <FieldLabel>Start time</FieldLabel>
          <TimeSelection>
            <SelectionWindow>
              {isSelecting.hour ? (
                <Ul ref={hoursContainerRef}>
                  {HOURS_ARRAY.map((hour) => (
                    <Li key={hour + "h"}>
                      <RadioInput name="hour" id={hour + "h"} key={hour} value={hour} checked={selectedValues.time.hour === hour} onChange={handleRadioChange} />
                      <SelectionItem htmlFor={hour + "h"}>{hour}</SelectionItem>
                    </Li>
                  ))}
                </Ul>
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
            </SelectionWindow>
            <span>:</span>
            <SelectionWindow>
              {isSelecting.minute ? (
                <Ul ref={minutesContainerRef}>
                  {MINUTES_ARRAY.map((minute) => (
                    <Li key={minute + "m"}>
                      <RadioInput name="minute" id={minute + "m"} key={minute} value={minute} checked={selectedValues.time.minute === minute} onChange={handleRadioChange} />
                      <SelectionItem htmlFor={minute + "m"}>{minute}</SelectionItem>
                    </Li>
                  ))}
                </Ul>
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
            </SelectionWindow>
            <AMPMWrapper>
              <RadioInput name="AMPM" id="AM" value="AM" checked={selectedValues.time.AMPM === "AM"} onChange={handleRadioChange} />
              <SelectBox htmlFor="AM">AM</SelectBox>
              <RadioInput name="AMPM" id="PM" value="PM" checked={selectedValues.time.AMPM === "PM"} onChange={handleRadioChange} />
              <SelectBox htmlFor="PM">PM</SelectBox>
            </AMPMWrapper>
          </TimeSelection>
        </UpperRowWrapper>
        <LowerRowWrapper>
          <ReapeatOnWrapper>
            <FieldLabel>Repeat on</FieldLabel>
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
          </ReapeatOnWrapper>

          <ButtonsWrapper>
            <AddSchedulePageButton
              onClick={() => {
                navigate("/");
              }}
            >
              Back To View Schedule
            </AddSchedulePageButton>
            <AddSchedulePageButton onClick={onClickSave}>Save</AddSchedulePageButton>
          </ButtonsWrapper>
        </LowerRowWrapper>
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
  @media (max-width: 720px) {
    max-height: fit-content;
  }
`;

const FieldLabel = styled.h4`
  width: 6rem;
  @media (max-width: 720px) {
    width: 100%;
  }
`;
const UpperRowWrapper = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;

  > * {
    margin: 0.5rem;
  }
  * {
    z-index: 1;
  }
  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const TimeSelection = styled.div`
  display: flex;
  gap: 0.5rem;
  @media (max-width: 720px) {
    width: 100%;
    justify-content: left;
  }
`;
const SelectionWindow = styled.div`
  width: 3rem;
  height: 2rem;
  padding: 0;
  position: relative;
`;

const SelectedDisplay = styled.div`
  width: 3rem;
  height: 100%;
  border: ${theme.borderColor} 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Ul = styled.ul`
  width: 100%;
  top: 0;
  position: absolute;
  overflow: hidden;
  border: ${theme.borderColor} 1px solid;
`;

const Li = styled.li`
  width: 100%;
  height: 2rem;
  background-color: white;
  border-bottom: ${theme.borderColor} 1px solid;
  &:last-child {
    border-bottom: none;
  }
`;
const AMPMWrapper = styled.div`
  display: flex;
  width: 5rem;
  height: 100%;
`;

const SelectionItem = styled.label`
  min-width: 3rem;
  padding: 1rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  }
`;

const LowerRowWrapper = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 1rem;
  padding-bottom: 1rem;
  > * {
    margin: 0 0.5rem;
  }
  @media (max-width: 720px) {
    flex-direction: column;
    height: fit-content;
  }
`;

const ReapeatOnWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  @media (max-width: 720px) {
    flex-direction: column;
    margin-bottom: 2rem;
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

const SelectBox = styled.label`
  min-width: 3rem;
  padding: 1rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${theme.borderColor} 1px solid;
  &:hover {
    box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  }
`;
const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 2rem;
`;
const AddSchedulePageButton = styled(Button)``;
