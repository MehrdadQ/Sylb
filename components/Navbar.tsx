import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import { auth } from '../utilities/firebase';
import { useRecoilState } from 'recoil';
import { userState } from '../utilities/atoms';

const CustomNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();


  const goToAddEntryPage = () => {
    router.push('/add-entry');
  };

  const goToLandingPage = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      goToLandingPage();
      setUser("");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  
  const goToHomePage = () => {
    router.push('/home');
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search/${searchQuery.trim()}`);
    }
  };

  return (
    <Sticky>
      <Navbar expand="sm" variant='dark'>
        <Navbar.Brand onClick={goToHomePage} style={{cursor: "pointer"}}>
          <Image
            src="../../logo.svg"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <FormContainer>
            <NavButton onClick={handleLogout}>Log out</NavButton>
            <NavButton onClick={goToAddEntryPage}>Add your syllabus</NavButton>
            <Form className="d-flex" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Enter course code..."
                  className="me-2"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                />
                <SearchButton type='submit' variant="outline-success">Search</SearchButton>
            </Form>
          </FormContainer>
        </Navbar.Collapse>
      </Navbar>
    </Sticky>
  );
}

const Sticky = styled.div`
  position: sticky;
  position: -webkit-sticky;
  width: 100%;
  top: 0;
  z-index: 100;
  background-color: #2D3748;
  color: #EDEDEE;
  border-bottom: 1px solid black;
  padding: 0px 30px;
`

const FormContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const NavButton = styled(Button)`
  background-color: #488ED8;
  border-color: #488ED8 !important;
  color: #ededee !important;
  margin-right: 1rem;
  &:hover {
    background-color: #2c82df !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:active {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:focus-visible {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
    box-shadow: 0 0 0 0.15rem rgba(255,255,255,0.7);
  }
`;

const SearchButton = styled(Button)`
  border-color: #488ED8 !important;
  color: #488ED8 !important;
  &:hover {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:active {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:focus-visible {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
    box-shadow: 0 0 0 0.15rem rgba(255,255,255,0.7);
  }
`;

export default CustomNavbar;
