import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <div className="bg-primary">
      <Container className="mb-4 px-4 pt-1">
        <Navbar expand="sm">
          <Navbar.Brand href="/" className="text-white">
            Search YouTube
          </Navbar.Brand>
        </Navbar>
      </Container>
    </div>
  );
}

export default Header;
