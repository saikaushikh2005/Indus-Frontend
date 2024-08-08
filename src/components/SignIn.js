import React, { useContext, useState } from 'react';
import { UserContext } from '../components/UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import logo from '../assets/logo.png';
import backgroundVideo from '../assets/signinbg.mp4';
import './../styles/SignIn.css';

const SignIn = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form inputs
  const validate = () => {
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8080/hr/signIn', null, {
          params: {
            username: formData.username,
            password: formData.password,
          },
        });

        if (response.status === 200) {
          let role;
          if (formData.username.includes('@admin')) {
            role = 'HR';
            navigate('/hr/dashboard');
          } else if (formData.username.includes('@user')) {
            role = 'Employee';
            navigate('/employee/dashboard');
          } else if (formData.username.includes('@lead')) {
            role = 'Manager';
            navigate('/manager/dashboard');
          } else {
            setErrors({ username: 'Invalid username' });
            return;
          }
          setUser({ username: formData.username, role });
          setSnackbarMessage('Sign In Successful!');
          setOpenSnackbar(true);
        } else {
          setErrors({ username: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        setErrors({
          username: 'Sign-in failed: ' + (error.response && error.response.data ? error.response.data.message : 'Unknown error')
        });
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Container component="main" maxWidth="xs" sx={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 2,
            boxShadow: 3,
            p: 4,
          }}
        >
          <img src={logo} alt="Company Logo" style={{ width: '100px', marginBottom: '20px' }} />
          <Typography component="h1" variant="h5" color="white" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignIn;
