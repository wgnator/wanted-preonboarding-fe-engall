import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { useUsersDBModel } from "../models/useUsersDBModel";
import { theme } from "../styles/theme";

export default function LoginPage() {
  const [inputValues, setInputValues] = useState({ userID: null, password: null });
  const { getUser } = useUsersDBModel();
  const navigate = useNavigate();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [event.target?.name]: event.target?.value });
  };

  const verifyUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValues.userID !== null && inputValues.password !== null)
      getUser(inputValues.userID, inputValues.password).then((response) => {
        if (response.data.length > 0) {
          localStorage.setItem("userID", response.data[0].id);
          navigate("/view_schedule");
        }
      });
    else alert("please enter your ID and password");
  };

  return (
    <Container>
      <h1>
        EngAll
        <br />
        Tutor Login
      </h1>
      <Form onSubmit={verifyUser}>
        <Field>
          <label htmlFor="userID">ID: </label>
          <input type="text" id="userID" name="userID" onChange={handleInputChange} />
        </Field>
        <Field>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" onChange={handleInputChange} />
        </Field>
        <Button>Login</Button>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 30rem;
  height: 30rem;
  margin: 10rem auto;
  padding: 3rem;
  box-shadow: 1px 3px 3px 0px ${theme.shadowDarkColor};

  > * {
    width: 60%;
    margin: 3rem auto;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 2rem;
  }
`;

const Field = styled.fieldset`
  display: flex;
  justify-content: space-between;
`;
