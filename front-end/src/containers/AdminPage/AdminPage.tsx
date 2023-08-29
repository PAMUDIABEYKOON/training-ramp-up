import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { registerApi } from '../../api/authApi';
import { NavBar } from '../../components/NavigationBar/NavigationBar';

export const Admin = () => {
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
        const response = await registerApi(username, password, role);
        if (response) {
          alert('Successfully added user');
        }
      } else {
        alert('Password should contain at least 6 characters');
      }
    } else {
      alert('Invalid Email. Provide a valid Email');
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          height: 'auto',
          backgroundColor: '#e1e8e8',
          display: 'flex',
          padding: '20px',
          margin: '20px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Typography variant="h5">Add New Users Here </Typography>
        </Box>
        <TextField
          required
          variant="outlined"
          label="User Email"
          size="small"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          sx={{ marginBottom: '15px', width: '500px' }}
        />
        <TextField
          required
          variant="outlined"
          label="Password"
          size="small"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ marginBottom: '15px', width: '500px' }}
        />
        <RadioGroup
          row
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <FormControlLabel value="admin" label="Admin" control={<Radio />} />
          <FormControlLabel value="user" label="User" control={<Radio />} />
        </RadioGroup>
        <Button
          variant="outlined"
          disabled={isCreateUserDisabled}
          onClick={handleCreateUserClick}
          sx={{ marginTop: '40px', width: '500px' }}
        >
          Create User
        </Button>
      </Box>
      <Box
        sx={{
          height: 'auto',
          backgroundColor: '#e1e8e8',
          display: 'flex',
          padding: '20px',
          margin: '20px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Typography variant="h5">
            Grant Admin Access To Existing Users
          </Typography>
        </Box>
        <TextField
          required
          variant="outlined"
          label="User Email"
          size="small"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          sx={{ marginBottom: '15px', width: '500px' }}
        />
        <Button
          variant="outlined"
          disabled={isCreateUserDisabled}
          onClick={handleCreateUserClick}
          sx={{ marginTop: '40px', width: '500px' }}
        >
          Grant Admin Access
        </Button>
      </Box>
    </>
  );
};
