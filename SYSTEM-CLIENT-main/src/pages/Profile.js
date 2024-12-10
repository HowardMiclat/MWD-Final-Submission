import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card, Col, Row, Alert, Spinner } from 'react-bootstrap';

// Utility function for API calls
const apiRequest = async (url, method, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  return response.json();
};

// Profile Details Component
const ProfileDetails = ({ user }) => (
  <div className="col-lg-6 mx-auto">
    <h3 className="text-center mb-4">
      Welcome to your profile, {user.firstName} {user.lastName}!
    </h3>
    <p><b>First Name:</b> {user.firstName}</p>
    <p><b>Last Name:</b> {user.lastName}</p>
    <p><b>Email:</b> {user.email}</p>
    <p><b>Status:</b> {user.isAdmin ? 'Admin' : 'Regular'}</p>
  </div>
);

// Change Password Form Component
const ChangePasswordForm = ({
  oldPassword,
  newPassword,
  confirmNewPassword,
  setOldPassword,
  setNewPassword,
  setConfirmNewPassword,
  handleSubmit,
  message,
}) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="oldPassword" className="mb-3">
      <Form.Label><b>Current Password</b></Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter current password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
    </Form.Group>

    <Form.Group controlId="newPassword" className="mb-3">
      <Form.Label><b>New Password</b></Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </Form.Group>

    <Form.Group controlId="confirmNewPassword" className="mb-3">
      <Form.Label><b>Confirm New Password</b></Form.Label>
      <Form.Control
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
    </Form.Group>

    <Button variant="primary" type="submit" block>
      Update Password
    </Button>

    {message && (
      <Alert
        variant={message.includes('Error') ? 'danger' : 'success'}
        className="mt-3"
      >
        {message}
      </Alert>
    )}
  </Form>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiRequest('http://localhost:4000/users/details', 'POST');
        if (data.code === 'USER-FOUND') {
          setUser(data.result);
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle password update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const data = await apiRequest(
        'http://localhost:4000/users/update-password',
        'PUT',
        { oldPassword, newPassword, confirmNewPassword }
      );
      setMessage(data.message);
    } catch (err) {
      setMessage('Error updating password.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 display-3 fw-bold">My Profile</h1>
      <Card className="shadow-sm p-4">
        <Card.Body>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <ProfileDetails user={user} />
              <hr className="mx-8 mt-7" />
              <Row>
                <h3 className="text-center mb-4">Change Password</h3>
                <Col md={6} className="mx-auto mt-3">
                  <ChangePasswordForm
                    oldPassword={oldPassword}
                    newPassword={newPassword}
                    confirmNewPassword={confirmNewPassword}
                    setOldPassword={setOldPassword}
                    setNewPassword={setNewPassword}
                    setConfirmNewPassword={setConfirmNewPassword}
                    handleSubmit={handleSubmit}
                    message={message}
                  />
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
