import { PropsWithChildren, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";

type ConfirmationModalType = PropsWithChildren & {
  onConfirm: (isConfirmed: boolean) => void;
  confirmationType: "confirm or reject" | "confirm only";
};
export default function ConfirmationModal({ onConfirm, children, confirmationType }: ConfirmationModalType) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    console.log(containerRef.current?.offsetHeight);
    setContainerHeight(containerRef.current?.offsetHeight || 0);
  }, []);
  return (
    <Container ref={containerRef} height={containerHeight}>
      <Message>{children}</Message>
      <ButtonWrapper>
        {confirmationType === "confirm or reject" ? (
          <>
            <YesButton onClick={() => onConfirm(true)}>Yes</YesButton>
            <NoButton onClick={() => onConfirm(false)}>No</NoButton>
          </>
        ) : (
          <ConfirmButton onClick={() => onConfirm(true)}>Confirm</ConfirmButton>
        )}
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div<{ height: number }>`
  position: fixed;
  background-color: rgb(226 226 226);
  max-width: 30rem;

  /* border: black solid 1px; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: calc((100vh - ${(props) => props.height}px) / 2);
  left: calc((100vw - 20rem) / 2);
  * {
    margin: 0.5rem;
    text-align: center;
  }

  box-shadow: 5px 5px 5px rgb(0, 0, 0, 0.5);
  animation: appear-opacity 1s forwards;
`;

const Message = styled.pre`
  width: 100%;
  font-weight: bold;
  font-size: large;
  white-space: pre-wrap;
  padding: 1rem;
`;
const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const YesButton = styled(Button)`
  background-color: rgb(214, 80, 80);
  width: 40%;
`;

const NoButton = styled(Button)`
  background-color: rgb(95, 184, 95);
  width: 40%;
`;

const ConfirmButton = styled(Button)`
  background-color: rgb(95, 184, 95);
  width: 40%;
`;
