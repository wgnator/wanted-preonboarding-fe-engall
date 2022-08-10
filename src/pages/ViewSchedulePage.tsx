import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useScheduleModel } from "../models/useScheduleModel";
import { theme } from "../styles/theme";
import { convertToTimeInDayString, DAYS_SEQUENCE } from "../utils/timeCalculations";
import xIcon from "../images/xIcon.png";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

const DAYS = Object.keys(DAYS_SEQUENCE);

export default function ViewSchedulePage() {
  const navigate = useNavigate();
  const { slotsArray, deleteSlot } = useScheduleModel();
  const [deleteRequestedID, setDeleteRequestedID] = useState<number | null>(null);

  return (
    <Container>
      <TitleWrapper>
        <PageTitle>Class Schedule</PageTitle>
        <Button onClick={() => navigate("/add_schedule")}>Add Class Schedule</Button>
      </TitleWrapper>
      <ScheduleDisplay>
        {slotsArray.map((slotsInDay, dayIndex) => (
          <DayColumn key={dayIndex}>
            <DayLabel>{DAYS[dayIndex]}</DayLabel>
            {slotsInDay &&
              slotsInDay.map((slot) => (
                <Slot key={slot.id}>
                  <TimeText>
                    {convertToTimeInDayString(slot.startTime)} - {convertToTimeInDayString(slot.endTime)}
                  </TimeText>
                  <RemoveIcon
                    onClick={() => {
                      setDeleteRequestedID(slot.id || null);
                    }}
                  />
                </Slot>
              ))}
          </DayColumn>
        ))}
      </ScheduleDisplay>
      {deleteRequestedID && (
        <ConfirmationModal
          message={"Are you sure to delete this schedule?"}
          callback={(isConfirmed) => {
            if (isConfirmed && deleteRequestedID) deleteSlot(deleteRequestedID);
            setDeleteRequestedID(null);
          }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  min-width: 780px;
  margin: 0 auto;
`;
const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ScheduleDisplay = styled.div`
  width: 100%;
  min-height: 15rem;

  padding: 1rem;
  box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  background-color: white;
  display: flex;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0px;
`;
const DayLabel = styled.div`
  border-bottom: 1px solid black;
  text-align: center;
  width: 100%;
`;
const Slot = styled.div`
  background-color: ${theme.elementBackroundColor};
  min-height: 3rem;
  width: 75%;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 0.3rem;
`;

const TimeText = styled.div`
  width: 80%;
  color: ${theme.elementFontColor};
`;
const RemoveIcon = styled.img.attrs((props) => ({ src: xIcon }))`
  width: 1rem;
  height: 1rem;
  color: ${theme.elementBackroundColor};
  border-radius: 50%;
`;
