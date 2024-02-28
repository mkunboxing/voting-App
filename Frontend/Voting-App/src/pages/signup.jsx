import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    aadharNumber: '',
    password: '',
    role: 'voter',
    isVoted: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to backend route
      const response = await axios.post('http://localhost:8000/user/signup', formData);
      console.log('Backend response:', response.data);

      // Redirect to the login page after successful submission
      navigate('user/login');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        type="number"
        required
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Mobile"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Aadhar Number"
        name="aadharNumber"
        value={formData.aadharNumber}
        onChange={handleChange}
        type="number"
        required
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        required
        fullWidth
        style={{ marginBottom: '1rem', }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default UserForm;
