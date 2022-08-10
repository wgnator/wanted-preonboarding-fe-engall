import styled from "styled-components";
import Button from "../components/Button";
import { theme } from "../styles/theme";

type ConfirmationModalType = {
  message: string;
  callback: (isConfirmed: boolean) => void;
};
export default function ConfirmationModal({ message, callback }: ConfirmationModalType) {
  return (
    <Container>
      <h3>{message}</h3>
      <ButtonWrapper>
        <Button style={{ backgroundColor: "rgb(214, 80, 80)", width: "40%" }} onClick={() => callback(true)}>
          Yes
        </Button>
        <Button style={{ backgroundColor: "rgb(95, 184, 95)", width: "40%" }} onClick={() => callback(false)}>
          No
        </Button>
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
