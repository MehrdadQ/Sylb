import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import EmailSvg from "../public/email.svg";
import GoogleSvg from "../public/google.svg";
import { addUserToCollection } from '../utilities/api';
import { userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';

const SignUpPage: NextPage = () => {
  const [isEmail, setIsEmail] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const [user, setUser] = useRecoilState(userState);

  const spanRef = useRef<HTMLSpanElement>(null);

  const router = useRouter();

  useEffect(() => {
    const goToHome = () => {
      router.push("/home")
    }
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUser(uid)
        goToHome();
      }
    });
  }, [])

  useEffect(() => {
    const newErrors = [];
    if (password.length < 7) {
      newErrors.push("Password must be at least 7 characters long");
    }
    if (password !== passwordConfirm) {
      newErrors.push("Passwords do not match");
    }
    setErrors(newErrors);
  }, [password, passwordConfirm]);


  const setLoggedInUser = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      const uid = currentUser.uid;
      setUser(uid);
      await addUserToCollection(uid);
      goToHome();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      spanRef.current?.click();
    }
  };

  const goToLogin = () => {
    router.push("/login")
  }

  const goToHome = () => {
    router.push("/home")
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      await setLoggedInUser();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors(["The email address you provided is already in use. Please try a different email address."]);
      } else if (error.code === 'auth/invalid-email') {
        setErrors(["Invalid email address entered."]);
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrors(["This operation is not allowed. Please contact the site administrator for more information."]);
      } else if (error.code === 'auth/weak-password') {
        setErrors(["The password you provided is not strong enough. Please choose a stronger password."]);
      } else {
        setErrors([error.message]);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      setLoggedInUser();
    } catch (error) {
      console.error('Error signing up with Google:', error);
    }
  };

  return (
    <SignUpPageContainer>
      <InputContainer>
        {!isEmail ? <SignupOptionsContainer>
          <Title>Create an account</Title>
          <SignupButton style={{marginBottom: "1rem"}} onClick={handleGoogleSignup}>
            <Image src={GoogleSvg} width={25} height={25} alt='Google logo'/>
            <div>Sign up with Google</div>
          </SignupButton>
          <SignupButton onClick={() => setIsEmail(true)}>
            <Image src={EmailSvg} width={25} height={25} alt='Email logo'/>
            <div>Sign up using Email</div>
          </SignupButton>
          <DividerLine/>
          <LoginMessage>
            Already have an account?{' '}
            <span
              onClick={goToLogin}
              tabIndex={0}
              ref={spanRef}
              onKeyDown={handleKeyDown}
            >
              Log in here.
            </span>
          </LoginMessage>
        </SignupOptionsContainer> :
        <FormContainer>
          <SignUpForm onSubmit={handleSignup}>
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
            <Label>Confirm Password:</Label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e: any) => setPasswordConfirm(e.target.value)}
            />
            {errors.length > 0 && <ErrorMessage>{errors[0]}</ErrorMessage>}
            <ButtonGroup>
              <Button onClick={() => setIsEmail(false)}>Back to sign up options</Button>
              <Button
                type="submit"
                style={{backgroundColor: "#488ED8", color: "#EDEDEE"}}
                disabled={errors.length > 0 || email === ""}
              >
                Sign Up
              </Button>
            </ButtonGroup>
          </SignUpForm>
        </FormContainer>}
      </InputContainer>
    </SignUpPageContainer>
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

const LoginMessage = styled.p`
  span {
    color: #488ED8;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.p`
  color: #d85252;
`;

const SignUpPageContainer = styled.div`
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

const SignupOptionsContainer = styled.div`
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

const SignupButton = styled.button`
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

const SignUpForm = styled.form`
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

export default SignUpPage;
