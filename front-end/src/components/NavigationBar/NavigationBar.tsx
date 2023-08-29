import { Box, Button, Typography } from '@mui/material';
import { logoutApi } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const NavBar = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state: any) => state.user.userRole);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const handleAddUsers = () => {
    navigate('/admin');
  };
  const handleViewUserTable = () => {
    navigate('/main');
  };

  const handleLogOutClick = async () => {
    localStorage.removeItem('token');
    const response = await logoutApi();
    console.log(response.message);
    if (response) {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        height: 'auto',
        backgroundColor: '#161717',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white' }}>
        {' '}
        {currentUser}{' '}
      </Typography>
      <Box>
        {userRole === 'admin' && (
          <>
            <Button
              onClick={handleAddUsers}
              sx={{ color: 'white', marginRight: '5px' }}
            >
              Add Users
            </Button>
            <Button
              onClick={handleViewUserTable}
              sx={{ color: 'white', marginRight: '5px' }}
            >
              View User Table
            </Button>
          </>
        )}
        <Button onClick={handleLogOutClick} sx={{ color: 'white' }}>
          LogOut
        </Button>
      </Box>
    </Box>
  );
};
