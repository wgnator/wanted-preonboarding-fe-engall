import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { useUsersDBModel } from "../models/useUsersDBModel";
import { theme } from "../styles/theme";

export default function LoginPage() {
  const [inputValues, setInputValues] = useState({ userID: null, password: null });
  const { verifyUser } = useUsersDBModel();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [event.target?.name]: event.target?.value });
  };

  return (
    <Container>
      <h1>
        EngAll
        <br />
        Tutor Login
      </h1>
      <LoginWrapper>
        <Field>
          <label htmlFor="userID">ID: </label>
          <input type="text" id="userID" name="userID" onChange={handleInputChange} />
        </Field>
        <Field>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" onChange={handleInputChange} />
        </Field>
        <Button onClick={() => verifyUser(inputValues.userID, inputValues.password)}>Login</Button>
      </LoginWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 30rem;
  height: 30rem;
  margin: 10rem auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};

  > * {
    width: 60%;
  }

  @media (max-width: 720px) {
    width: 100%;
    height: 100vh;
    margin: 0;
    > * {
      width: 90%;
      margin: 1rem auto;
    }
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 2rem;
  }
`;

const Field = styled.fieldset`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
