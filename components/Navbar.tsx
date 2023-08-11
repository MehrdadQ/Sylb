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

  const isActive = (pathname: string) => {
    return router.asPath === pathname ? 'active' : '';
  };

  return (
    <Sticky>
      <Navbar expand="sm" variant='dark'>
        <Navbar.Brand onClick={goToLandingPage} style={{cursor: "pointer"}}>
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
          <NavBody>
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
              <CustomNavDropdown title="Tools" id="basic-nav-dropdown" style={{padding: "0"}}>
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
            </Nav>
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
          </NavBody>
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
    width: 300px;
    overflow: hidden;
  }
  
  .dropdown-item {
    transition: all 0.5s;
  }

  .dropdown-item:focus, .dropdown-item:hover {
    padding-left: 25px;
  }
  
  .dropdown-item.active, .dropdown-item:active {
    background-color: #488ed8 ;
  }
`;

export default CustomNavbar;
