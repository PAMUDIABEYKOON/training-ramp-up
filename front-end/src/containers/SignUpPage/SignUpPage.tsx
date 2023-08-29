import { Alert, AlertProps, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCurrentUser, setUserRole } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { registerApi, userAuthenticatedApi } from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import { JwtPayload } from '../LoginPage/LoginPage';
import React from 'react';

export const SignUp = () => {

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const isRegisterDisabled =
    username.trim() === '' ||
    password.trim() === '' ||
    confirmedPassword.trim() === '';
  const passwordsMatch = password === confirmedPassword;
  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };
  const role = 'user';

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = async () => {
    if (isEmailValid(username)) {
      if (passwordsMatch) {
        if (password.length >= 6) {
          try {
            const response = await registerApi(username, password, role);

            if (response) {
              localStorage.setItem('token', response.data.token);

              const isAuthenticated = await userAuthenticatedApi();
              if (isAuthenticated) {
                const decoded = jwt_decode(response.data.token) as JwtPayload;
                dispatch(setCurrentUser(decoded.username));
                dispatch(setUserRole('user'));
                navigate('/main');
              }
            }
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === 'User already exists'
            ) {
              setSnackbar({ children: 'User already exists', severity: 'error' });
            } else {
              setSnackbar({ children: 'An error occured. Please try again' , severity: 'error' });
            }
          }
        } else {
          setSnackbar({ children: 'Password should contain at least 6 characters', severity: 'error' });
        }
      } else {
        setSnackbar({ children: 'Passwords do not match', severity: 'error' });
      }
    } else {
      setSnackbar({ children: 'Invalid email. Please enter a valid email', severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        height: 'auto',
        alignItems: 'center',
        display: 'flex',
        marginTop: '100px',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ width: '600px', backgroundColor: '#e1e8e8' }}>
        <Typography 
          variant="h5" 
          sx={{ marginBottom: '20px', marginTop: '20px' }}
        >
          Register Here
        </Typography>
        <TextField
          required
          variant="filled"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '15px', width: '500px' }}
        />
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            required
            variant="filled"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: '15px', width: '240px', marginRight: '20px' }}
          />
          <TextField
            required
            variant="filled"
            placeholder="Confirm Password"
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            sx={{ marginBottom: '15px', width: '240px' }}
          />
        </Box>
        <Box
          sx={{
            margin: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            onClick={handleRegisterClick}
            disabled={isRegisterDisabled}
            sx={{ marginBottom: '15px', width: '230px' }}
          >
            Register
          </Button>
          <Button 
            variant="text" 
            onClick={handleLoginClick}
          >
            Already have an account?
          </Button>
        </Box>
      </Box>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
    
  );
};
