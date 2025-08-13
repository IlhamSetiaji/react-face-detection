import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>
          <i className="bi bi-search me-2"></i>
          Face Detection App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="bi bi-upload me-1"></i>
                Upload Image
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/camera">
              <Nav.Link>
                <i className="bi bi-camera-video me-1"></i>
                Camera Detection
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/realtime">
              <Nav.Link>
                <i className="bi bi-broadcast me-1"></i>
                Real-time Detection
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};