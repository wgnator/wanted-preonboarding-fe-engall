import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useScheduleDB } from "../api-requests/useScheduleDB";
import { theme } from "../styles/theme";
import { convertToTimeInDayString, DAYS_TEXT } from "../utils/timeCalculations";
import xIcon from "../images/xIcon.png";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingCircle from "../components/LoadingCircle";

export default function ViewSchedulePage() {
  const navigate = useNavigate();
  const { slotsArray, deleteSlot, isLoading } = useScheduleDB();
  const [deleteRequestedID, setDeleteRequestedID] = useState<null | number>(null);

  const confirmDelete = (slotID: number) => {
    setDeleteRequestedID(slotID);
  };

  return (
    <Container>
      <TitleWrapper>
        <PageTitle>Class Schedule</PageTitle>
        <Button onClick={() => navigate("/add_schedule")}>Add Class Schedule</Button>
      </TitleWrapper>
      <ScheduleDisplay isLoading={isLoading}>
        {isLoading ? (
          <LoadingCircle color={theme.headerBackgroundColor} backgroundColor="white" />
        ) : (
          slotsArray.map((slotsInDay, dayIndex) => (
            <DayColumn key={dayIndex}>
              <DayLabel>{DAYS_TEXT[dayIndex]}</DayLabel>
              {slotsInDay &&
                slotsInDay.map((slot) => (
                  <Slot key={slot.id}>
                    <TimeText>
                      {convertToTimeInDayString(slot.startTime)} - {convertToTimeInDayString(slot.endTime)}
                    </TimeText>
                    <RemoveIcon onClick={() => slot.id && confirmDelete(slot.id)} />
                  </Slot>
                ))}
            </DayColumn>
          ))
        )}
      </ScheduleDisplay>
      {deleteRequestedID && (
        <ConfirmationModal
          confirmationType="confirm or reject"
          onConfirm={(isConfirmed) => {
            isConfirmed && deleteSlot(deleteRequestedID);
            setDeleteRequestedID(null);
          }}
        >
          Are you sure to delete this schedule?
        </ConfirmationModal>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  min-width: 780px;
  margin: 0 auto;
  @media (max-width: 720px) {
    max-width: none;
    min-width: 0;
  }
`;
const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ScheduleDisplay = styled.div<{ isLoading: boolean }>`
  width: 100%;
  min-height: 15rem;
  position: relative;
  padding: 1rem;
  box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};
  background-color: white;
  display: flex;
  ${(props) =>
    props.isLoading &&
    `
    justify-content: center;
    align-items: center;
    height: 15rem;
  `}
  @media (max-width: 720px) {
    flex-direction: column;
  }
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
  justify-content: center;
  align-items: center;
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
