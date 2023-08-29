import {
  Alert,
  AlertProps,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { registerApi } from '../../api/authApi';
import { NavBar } from '../../components/NavigationBar/NavigationBar';
import React from 'react';

export const Admin = () => {

  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const isCreateUserDisabled =
    username.trim() === '' || password.trim() === '' || role === '';
  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleCreateUserClick = async () => {
    if (isEmailValid(username)) {
      if (password.length >= 6) {
        try {
          const response = await registerApi(username, password, role);
          if (response) {
            setSnackbar({ children: 'Successfully added user', severity: 'success' });
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
      setSnackbar({ children: 'Invalid email. Please enter a valid email', severity: 'error' });
    }
  };

  return (
    <>
      <NavBar />
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
            Add New Users Here
          </Typography>
          <TextField
            required
            variant="outlined"
            placeholder="User Email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            sx={{ marginBottom: '15px', width: '500px' }}
          />
          <TextField
            required
            variant="outlined"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            sx={{ marginBottom: '15px', width: '500px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}></Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <RadioGroup
            row
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <FormControlLabel value="admin" label="Admin" control={<Radio />} />
            <FormControlLabel value="user" label="User" control={<Radio />} />
          </RadioGroup>
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
            variant="outlined"
            disabled={isCreateUserDisabled}
            onClick={handleCreateUserClick}
            sx={{ marginTop: '40px', width: '500px' }}
            >
            Create User
            </Button>
          </Box>
        </Box>
        {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      </Box>
    </>
  );
};
