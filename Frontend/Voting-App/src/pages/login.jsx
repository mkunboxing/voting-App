import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      // Make API request to your backend for authentication
      const response = await yourAuthApi.login(formData);
      const token = response.data.token;

      // Save the token to local storage
      localStorage.setItem('jwtToken', token);

      // Redirect to a protected route or perform other actions
      navigate('/user/dashboard'); // Replace with the desired route
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, show error message, etc.
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          fullWidth
        />
        <Button onClick={handleLogin} variant="contained" color="primary">
          Login
        </Button>
      </form>
      <p>
        Don't have an account? <Link to="/">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
