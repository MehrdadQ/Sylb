import Image from 'next/image';
import { useRouter } from 'next/router';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { styled } from 'styled-components';


const NavigationBar = () => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/signup');
  };
  
  const handleLoginClick = () => {
    router.push('/login');
  }
  
  return (
    <Sticky>
      <Navbar>
        <Navbar.Brand href="#">
          <Image
            src="logo.svg"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ButtonContainer>
            <Nav>
              <NavItem>
                <NavButton onClick={handleSignUpClick}>
                  Sign up
                </NavButton>
              </NavItem>
              <NavItem>
                <NavButton onClick={handleLoginClick}>
                  Log in
                </NavButton>
              </NavItem>
            </Nav>
          </ButtonContainer>
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

const ButtonContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const NavButton = styled.button`
  padding-left: 20px;
  margin-left: 20px;
  border: none;
  background-color: transparent;
  transition: background-color 0.3s, transform 0.3s;

  &:disabled {
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: none;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 0px 8px;
    margin: 0px 8px;
  }
`


export default NavigationBar;
