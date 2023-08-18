import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import CreditIcon from '../public/credit.svg';
import InfiniteIcon from '../public/infinite.svg';
import LoadingIcon from "../public/loading.svg";
import { getUserInfo } from '../utilities/api';
import { userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';

const CustomNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    const goToLogin = () => {
      router.push("/login")
    }
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        if (!user) {
          setUser(await getUserInfo(uid));
        }
      } else {
        goToLogin();
      }
    });
  }, [setUser, user, router])

  const goToLandingPage = () => {
    router.push('/');
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search/${searchQuery.trim()}`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      goToLandingPage();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (pathname: string) => {
    return router.asPath === pathname ? 'active' : '';
  };

  return (
    <Sticky>
       <Navbar expand="lg" variant='dark'>
        <div>
          <Navbar.Brand as={Link} href='/' style={{cursor: "pointer"}}>
            <Image
              src="../../logo.svg"
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{padding: "9px"}}/>
        </div>
        <StyledOffCanvas id="basic-navbar-nav" placement="top">
          <NavBody style={{float: "right"}}>
            <Nav>
              <Nav.Link as={Link} href="/home" className={isActive("/home")}>Home</Nav.Link>
              <Nav.Link as={Link} href="/shop" className={isActive("/shop")}>
                <Image src={CreditIcon} width={25} height={25} alt='credit' />
                Credits:{' '}
                {!user ? 
                  <Image src={LoadingIcon} alt='loading' style={{width: "18px", height: 'auto'}}/> :
                  user?.credits! > 10000 ?
                  <Image src={InfiniteIcon} width={22} height={22} alt='infinite'/>
                  : user?.credits
                }
              </Nav.Link>
              <Nav.Link as={Link} href="/add-entry" className={isActive("/add-entry")}>Add your syllabus</Nav.Link>
              <CustomNavDropdown title="Explore" id="basic-nav-dropdown" style={{padding: "0"}}>
                <NavDropdown.Item as={Link} href="/advanced-search" className={isActive("/advanced-search")}>
                  Advanced Search
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/sort-by/courseAverage" className={isActive("/sort-by/courseAverage")}>
                  Top courses by course average
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/sort-by/semester" className={isActive("/sort-by/semester")}>
                  Most recent courses
                </NavDropdown.Item>
              </CustomNavDropdown>
              <CustomNavDropdown title="More" id="basic-nav-dropdown" style={{padding: "0"}}>
                <NavDropdown.Item as={Link} href="/contact" className={isActive("/contact")}>
                  Contact
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Log out
                </NavDropdown.Item>
              </CustomNavDropdown>
            </Nav>
          </NavBody>
        </StyledOffCanvas>
      </Navbar>
      <FormContainer>
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
    </Sticky>
  );
}

const StyledOffCanvas = styled(Navbar.Offcanvas)`
  background-color: #2D3748;
  padding: 0 10px;
  
  @media (max-width: 991px) {
    padding: 2rem;

    a {
      color: hsla(0, 0%, 100%, 0.55);

      &.dropdown-item {
        color: black !important;
        &:hover, &:active, &:focus {
          color: black !important;
        }
      }

      &:hover, &:active, &:focus, &.active {
        color: hsla(0, 0%, 100%, 0.75) !important;
      }
    }
  }
`;

const FormContainer = styled.div`
  padding: 14px 0;
  @media (max-width: 500px) {
    width: 60%;
  }
`;

const Sticky = styled.div`
  position: sticky;
  position: -webkit-sticky;
  width: 100%;
  display: flex;
  justify-content: space-between;
  top: 0;
  z-index: 100;
  background-color: #2D3748;
  color: #EDEDEE;
  border-bottom: 1px solid black;
  padding: 0px 30px;
  
  @media (max-width: 500px) {
    padding: 0px 10px;
  }
`;

const NavBody = styled.div`
  margin-left: auto;
  display: flex;
  width: 100%;
  justify-content: space-between;
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

const CustomNavDropdown = styled(NavDropdown)`
  .dropdown-menu  {
    padding: 0;
    border-radius: 5px !important;
    position: absolute;
    max-width: 250px;
    overflow: hidden;
  }

  .dropdown-item:focus, .dropdown-item:hover {
    font-weight: 600;
  }
  
  .dropdown-item.active, .dropdown-item:active {
    background-color: #488ed8 ;
  }
`;

export default CustomNavbar;
