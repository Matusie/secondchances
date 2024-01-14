
import Link from 'next/link';
import Image from 'next/image'
import Logo from './log.png'
import signup from './signup.png'
import Logo2 from './logo.js'
import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';

// Add the Bootstrap JavaScript library
export default ({ currentUser }) => {
  const router = useRouter();
  const [buttonWidth, settButtonWidth] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  
  useEffect(() => {
    const buttonElement = document.querySelector('.btn-acc');
    const buttonWidth = buttonElement?.getBoundingClientRect()?.width;
    settButtonWidth(buttonWidth);
  }, []);
  
  const handleSelect = (eventKey) => {
    const activeItem = document.querySelector('.dropdown-item.active');
    if (activeItem) {
      activeItem.classList.remove('active');
    }
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.setAttribute('aria-selected', 'false');
  });
  
    switch (eventKey) {
      case 'profile':
        Router.push('/users/[userId]', `/users/${currentUser.id}`);
        break;

      case 'signout':
        Router.push(`/auth/signout`);
        break;
      default:
        break;
    }
  };

  const links = [
    currentUser && { label: 'Itemy', href: '/items'},
    currentUser && { label: 'Twoje itemy', href: '/purchases'},
    currentUser && {label: `Dodaj itema`, href:'/items/add'},
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className={`nav-link  ${router.pathname === href ? 'active' : ''}`} href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    
      <Navbar className=' rounded-bottom ' bg="secondary" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="justify-content-between w-100 align-items-center ">
          <Link className="navbar-brand m-0 d-sm-flex  w-md-100 justify-content-center " href="/">
            <Logo2 />
          </Link>
          
          <ul className="navbar-nav w-md-100 text-center  col-lg-6 justify-content-lg-center">
            <div className="d-lg-flex">
            {links}
              </div>
          </ul>
            {!currentUser ? (
              <div className="d-lg-flex" >
                <button className="btn btn-sm btn-primary" onClick={()=>Router.push('/auth/signup')}>
                  Sign up
                </button>

                <button className="btn btn-primary mx-lg-2 " onClick={()=>Router.push('/auth/signin')}>
                  Sign in
                </button>
              </div>
            ):
            (
              <Dropdown onSelect={handleSelect} onClick={handleSelect}>
                <Dropdown.Toggle className='btn-acc position-relative ' variant="outline-primary" id="dropdown-basic" aria-selected="false">
                  {currentUser.email}
                </Dropdown.Toggle>

                <Dropdown.Menu className='p-0 flex-column ' style={{minWidth:`${buttonWidth}px`, maxWidth:`${buttonWidth}px`}}>
                  <Dropdown.Item aria-selected="false" eventKey="profile" className='d-flex ' style={{minWidth:'fit-content',padding:'0.5rem'}} >
                  <span className="material-icons">
                    person
                  </span>Konto
                  </Dropdown.Item>
                  <Dropdown.Item aria-selected="false" eventKey="signout" className='d-flex ' style={{minWidth:'fit-content',padding:'0.5rem'}} >
                    <span className="material-icons">
                      logout
                    </span> sign out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              // <div className="d-lg-flex">
              //   <div className="dropdown">
              //     <button id={`btnGroupDropAcc`} type="button" className="btn btn-sm btn-outline-secondary d-flex settings ms-1 dropdown-toggle align-items-center " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              //         <span className="material-icons">
              //             tune
              //         </span>
              //     </button>
              //     <div className="dropdown-menu" aria-labelledby={`btnGroupDropAcc`} style={{minWidth:'fit-content',padding:'0.5rem'}}>
              //         <button onClick={() => Router.push('/users/[userId]',`/users/${currentUser.id}`)} className="btn btn-sm btn-outline-secondary d-flex w-100 mb-1 ">
              //         <span className="material-icons">
              //             person
              //         </span>Konto
              //         </button>
              //         <button style={{width:'fit-content'}} onClick={() => Router.push(`/auth/signout`, )} className="btn btn-sm btn-outline-danger d-flex">
              //         <span className="material-icons">
              //             exit
              //         </span> sign out
              //         </button>
              //     </div>
              // </div>
                
              // </div>
            )
            }
          </Nav>
        </Navbar.Collapse>
        
      </Container>
      {/* <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-lg-flex justify-content-between " id="navbarsExample11">
          <Link className="navbar-brand" href="/">
            <Logo2 />
          </Link>
          
          <ul className="navbar-nav col-lg-6 justify-content-lg-center">
            {links}
            <div className="d-lg-flex">
                <span> sassss</span>    
              </div>
          </ul>
            {!currentUser ? (
              <div className="d-lg-flex" >
                <button className="btn btn-primary" onClick={()=>Router.push('/auth/signup')}>
                  Sign up
                </button>

                <button className="btn btn-primary mx-lg-2 " onClick={()=>Router.push('/auth/signin')}>
                  Sign in
                </button>
              </div>
            ):
            (
              <div className="d-lg-flex">
                <span> {currentUser.email}</span>    
              </div>
            )
            }
        </div>
      </div> */}
    </Navbar>
    
  );
  
};
