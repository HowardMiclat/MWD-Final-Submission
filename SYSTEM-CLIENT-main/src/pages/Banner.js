import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";  // Corrected import for Link
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function Banner() {
  return (
    <Row>
      <Col className="p-5 d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="display-3 fw-bold mb-3">University of the Assumption</h1>
        <p className="display-6 mb-5">Official Online Course Enrollment</p>
        
        {/* Use Link for client-side navigation */}
        <Link to="/login">
          <Button size="lg" className="rounded-pill py-3 px-5 shadow">
            Enroll Now!
          </Button>
        </Link>
      </Col>
    </Row>
  );
}
