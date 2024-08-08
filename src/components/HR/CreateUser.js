import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import Sidebar from '../HR/HRSidebar';
import './../../styles/HR/CreateUser.css';
import axios from 'axios';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  role: '',
  manager: ''
};

const CreateUser = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [managers, setManagers] = useState([]);
  const [managerFetchError, setManagerFetchError] = useState('');

  useEffect(() => {
    // Fetch managers only if the role is set and is not "Manager"
    if (formData.role && formData.role !== 'Manager') {
      axios.get('http://localhost:8080/manager/getAll') // Adjust the endpoint if necessary
        .then(response => {
          console.log('Managers fetched:', response.data); // Log fetched managers
          setManagers(response.data);
          setManagerFetchError('');
        })
        .catch(error => {
          console.error('Error fetching managers:', error);
          setManagerFetchError('Failed to fetch managers');
        });
    } else {
      // Clear managers if the role is "Manager" or not set
      setManagers([]);
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    if (name === 'role' && value === 'Manager') {
      setFormData(prevFormData => ({
        ...prevFormData,
        manager: '' // Clear manager if role is set to Manager
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.role && formData.role !== 'Manager' && !formData.manager) {
      newErrors.manager = 'Manager is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add default HR ID
    const userWithDefaultHR = { ...formData, hr: { id: 1 } };
    console.log('User data to be sent:', userWithDefaultHR); // Log user data

    axios.post('http://localhost:8080/user/add', userWithDefaultHR)
      .then(response => {
        console.log('User creation response:', response.data); // Log response
        const { role } = formData;
        setAlertMessage(role === 'Manager' ? 'A new Manager is created' : 'A new user is added');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setFormData(initialFormData);
        setErrors({});
      })
      .catch(error => {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
        setAlertMessage('Error creating user');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: '0 auto', minHeight: '80vh' }}>
          <Typography variant="h4" align="center" gutterBottom color="black">
            Create User
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value=""><em>Select Role</em></MenuItem>
                    <MenuItem value="FrontEnd">FrontEnd</MenuItem>
                    <MenuItem value="BackEnd">BackEnd</MenuItem>
                    <MenuItem value="Full Stack">Full Stack</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Cyber Security">Cyber Security</MenuItem>
                  </Select>
                  {errors.role && <Typography color="error">{errors.role}</Typography>}
                </FormControl>
              </Grid>
              {formData.role && formData.role !== 'Manager' && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={Boolean(errors.manager)}>
                    <InputLabel>Manager</InputLabel>
                    <Select
                      name="manager"
                      value={formData.manager}
                      onChange={handleChange}
                      label="Manager"
                    >
                      {managers.length > 0 ? (
                        managers.map(manager => (
                          <MenuItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>No Managers Available</MenuItem>
                      )}
                    </Select>
                    {errors.manager && <Typography color="error">{errors.manager}</Typography>}
                    {managerFetchError && <Typography color="error">{managerFetchError}</Typography>}
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
          {showAlert && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {alertMessage}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateUser;
