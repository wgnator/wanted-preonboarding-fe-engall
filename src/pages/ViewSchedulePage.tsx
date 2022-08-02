import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useScheduleModel } from "../models/useScheduleModel";
import { theme } from "../styles/theme";
import { convertToTimeInDayString, DAYS_SEQUENCE } from "../utils/timeCalculations";
import xIcon from "../images/xIcon.png";
import { useState } from "react";

const DAYS = Object.keys(DAYS_SEQUENCE);

export default function ViewSchedulePage() {
  const navigate = useNavigate();
  // if (!localStorage.userID) navigate("/");
  console.log("view schedule page entered");
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
        <DeleteConfirmModal>
          <h3>Are you sure to delete this schedule? </h3>
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <Button
              style={{ backgroundColor: "rgb(214, 80, 80)", width: "40%" }}
              onClick={() => {
                deleteRequestedID && deleteSlot(deleteRequestedID);
                setDeleteRequestedID(null);
              }}
            >
              Yes
            </Button>
            <Button
              style={{ backgroundColor: "rgb(95, 184, 95)", width: "40%" }}
              onClick={() => {
                setDeleteRequestedID(null);
              }}
            >
              No
            </Button>
          </div>
        </DeleteConfirmModal>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
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

const DeleteConfirmModal = styled.div`
  position: fixed;
  background-color: ${theme.pageBackgroundColor};
  width: 20rem;
  height: 10rem;
  border: black solid 1px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: calc((100vh - 10rem) / 2);
  left: calc((100vw - 20rem) / 2);
  * {
    margin: 0.5rem;
    text-align: center;
  }
`;
