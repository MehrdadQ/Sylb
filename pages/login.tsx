import { onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from "recoil";
import styled from 'styled-components';
import EmailSvg from "../public/email.svg";
import GoogleSvg from "../public/google.svg";
import { userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';

const LoginPage: NextPage = () => {
  const [isEmail, setIsEmail] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const [user, setUser] = useRecoilState(userState);

  const spanRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();


  useEffect(() => {
    setErrors([]);
  }, [password, email]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      spanRef.current?.click();
    }
  };

  const goToSignup = () => {
    router.push("/signup")
  }
  
  const goToForgotPassword = () => {
    router.push("/forgot-password")
  }

  const goToHome = () => {
    router.push("/home")
  }

  const setLoggedInUser = () => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUser(uid)
      }
    });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoggedInUser();
      goToHome();
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setErrors(["Invalid email address entered."])
      } else if (error.code === "auth/user-not-found") {
        setErrors(["The email address you entered is not registered. Please check the email address and try again, or sign up for a new account."])
      } else if (error.code === "auth/wrong-password") {
        setErrors(["The password you entered is incorrect. Please try again."])
      } else if (error.code === "auth/user-disabled") {
        setErrors(["Your account has been disabled. Please contact the site administrator for more information."])
      } else if (error.code === "auth/too-many-requests") {
        setErrors(["There have been too many failed login attempts. Please try again later."])
      } else {
        setErrors([error.message])
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      setLoggedInUser();
      goToHome();
    } catch (error: any) {
      setErrors(["Something went wrong. Try again."])
    }
  };

  return (
    <LoginPageContainer>
      <InputContainer>
        {!isEmail ? <LoginOptionsContainer>
          <Title>Login to your account</Title>
          <LoginButton style={{marginBottom: "1rem"}} onClick={handleGoogleLogin}>
            <Image src={GoogleSvg} width={25} height={25} alt='Google logo'/>
            <div>Log in with Google</div>
          </LoginButton>
          <LoginButton onClick={() => {setIsEmail(true); setErrors([])}}>
            <Image src={EmailSvg} width={25} height={25} alt='Email logo'/>
            <div>Log in using Email</div>
          </LoginButton>
          {errors.length > 0 && <ErrorMessage style={{padding: "1rem", margin: "0"}}>{errors[0]}</ErrorMessage>}
          <DividerLine/>
          <LoginMessage>
            Dont have an account?{' '}
            <span
              onClick={goToSignup}
              tabIndex={0}
              ref={spanRef}
              onKeyDown={handleKeyDown}
            >
              Create one here.
            </span>
          </LoginMessage>
        </LoginOptionsContainer> :
        <FormContainer>
          <LoginForm onSubmit={handleLogin}>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            <ForgotPasswordMessage>
              <p onClick={goToForgotPassword}>Forgot your password?</p>
            </ForgotPasswordMessage>
            {errors.length > 0 && <ErrorMessage>{errors[0]}</ErrorMessage>}
            <ButtonGroup>
              <Button onClick={() => setIsEmail(false)}>Back to login options</Button>
              <Button
                type="submit"
                style={{backgroundColor: "#488ED8", color: "#EDEDEE"}}
                disabled={errors.length > 0 || email === "" || password === ""}
              >
                Log In
              </Button>
            </ButtonGroup>
          </LoginForm>
        </FormContainer>}
      </InputContainer>
    </LoginPageContainer>
  );
};

const DividerLine = styled.hr`
  border: 0;
  clear: both;
  display: block;
  width: 70%;
  opacity: 1;
  background-color: #EDEDEE;
  height: 1px;
  margin: 1.5rem 1rem 1rem 1rem;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const ForgotPasswordMessage = styled.div`
  width: 100%;

  p {
    cursor: pointer;
    color: #acd6f1;
    float: right;
  }
`;

const LoginMessage = styled.p`
  span {
    color: #488ED8;
    cursor: pointer;
  }
`;

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

const LoginOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  width: 100%;
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

const LoginForm = styled.form`
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
