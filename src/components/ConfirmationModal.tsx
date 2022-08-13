import { ComponentPropsWithRef } from "react";
import { ComponentProps, PropsWithChildren } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { theme } from "../styles/theme";

type ConfirmationModalType = PropsWithChildren & {
  callback: (isConfirmed: boolean) => void;
};
export default function ConfirmationModal({ callback, children }: ConfirmationModalType) {
  return (
    <Container>
      <h3>{children}</h3>
      <ButtonWrapper>
        <YesButton onClick={() => callback(true)}>Yes</YesButton>
        <NoButton onClick={() => callback(false)}>No</NoButton>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
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
