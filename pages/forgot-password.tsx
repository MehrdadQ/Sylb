import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth } from '../utilities/firebase';

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    setErrors([]);
  }, [email]);

  const goToLogin = () => {
    router.push("/login")
  }

  const handleResetPassword =  async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.sendPasswordResetEmail(email)
    }

    catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setErrors(['Invalid email address entered.']);
      } else if (error.code === 'auth/user-not-found') {
        setErrors(["We could not find an account associated with the email address you provided. Please check that you have entered the correct email address or create a new account."]);
      } else if (error.code === 'auth/too-many-requests') {
        setErrors(["Too many requests, please try again later."]);
      } else {
        setErrors(['An unexpected error occurred. Please try again later.']);
      }
    }
  }

  return (
    <LoginPageContainer>
      <InputContainer>
        <FormContainer>
          <Form onSubmit={handleResetPassword}>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            {errors.length > 0 && <ErrorMessage>{errors[0]}</ErrorMessage>}
            <ButtonGroup>
              <Button
                onClick={goToLogin}
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                style={{backgroundColor: "#488ED8", color: "#EDEDEE"}}
                disabled={errors.length > 0 || email === ""}
              >
                Reset Password
              </Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </InputContainer>
    </LoginPageContainer>
  )
};

const ErrorMessage = styled.p`
  color: #d85252;
`;

const LoginPageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #0A121E;
`;

const InputContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1%;
  background-color: #2D3748;
  color: #EDEDEE;
  padding: 5rem;

  Input {
    width: 100%;
  }

  @media (max-width: 1200px) {
    padding: 2rem;
    width: 70%;
  }

  @media (max-width: 800px) {
    width: 90%;
  }
`;

const FormContainer = styled.div`
  position: relative;
  width: 80%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const LoginButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 13px 23px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: 70%;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    background-color: #F7F7F7;
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    border-color: #DDDDDD;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
  }

  div {
    margin-left: 18px;
  }

  @media (max-width: 800px) {
    font-size: 14px;
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  display: inline-block;
  font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 9px 15px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: auto;
  margin-top: 1rem;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    background-color: #F7F7F7;
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* @media (max-width: "1000px") {
    width: 100%;
  } */
`

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  input {
    padding: 5px 12px;
    font-size: 14px;
    line-height: 20px;
    color: #24292e;
    vertical-align: middle;
    background-color: #EDEDEE;
    background-repeat: no-repeat;
    background-position: right 8px center;
    border-radius: 6px;
    outline: none;
    box-shadow: rgba(225, 228, 232, 0.2) 0px 1px 0px 0px inset;
    &:focus {
        border-color: #0366d6;
        outline: none;
        box-shadow: rgba(3, 102, 214, 0.6) 0px 0px 0px 3px;
    }
  }
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 28px;
  margin-bottom: 1rem;

  @media (max-width: 800px) {
    font-size: 22px;
  }
`;

export default LoginPage;
