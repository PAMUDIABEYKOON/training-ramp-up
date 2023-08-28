import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, userAuthenticatedApi } from "../../api/authApi";
import jwt_decode from "jwt-decode"
import { useDispatch } from "react-redux";
import { setCurrentUser, setUserRole } from "../../redux/userSlice";
import { AxiosError } from "axios";

export interface JwtPayload {
    username: string;
    id: number;
    role: string;
}

export const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isLoginDisabled = username.trim() === '' || password.trim() === ''

    const handleRegisterClick = () => {
        navigate('/')
    }

    const handleLoginClick = async () => {
        try {
            
        const response = await loginApi(username, password);
        if (response) {
            localStorage.setItem("token", response.data.token );

            const isAuthenticated = await userAuthenticatedApi();
            if (isAuthenticated) {
                const decoded = jwt_decode(response.data.token) as JwtPayload;
                dispatch(setCurrentUser(decoded.username));
                if (decoded.role === "admin") {
                    dispatch(setUserRole('admin'))
                    navigate('/admin');
                } else if (decoded.role === "user") {
                    dispatch(setUserRole('user'))
                    navigate('/main');
                }
            }
        }
            
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorMessage = error.response.data || 'An error occurred during login.';
                alert(`Login error: ${errorMessage}`);
              } else {

                alert('An error occurred during login. Please try again.');
              }
        }
   

        //const users = useSelector((state: any) => state.user.users);

        // const foundUser = users.find((user: { username: string; password: string; }) => user.username === username && user.password === password);

        // if (foundUser) {

        //     dispatch(setCurrentUser(foundUser));
        //     if (foundUser.role === 'admin') {
        //         navigate('/admin');
        //     } else {
        //         navigate('/main');
        //     }
        // } else {
        //     alert('No user found for the given username and password');
        // }
    }

    return (
        <Box sx={{ height: 'auto', backgroundColor: 'white', alignItems:'center', display: 'flex', padding: '20px', margin: '20px', flexDirection: 'column' }}>
            <Box sx={{ width: '600px', backgroundColor: '#e1e8e8' }}>
                <Typography variant='h5' sx={{ marginBottom: '20px', marginTop: '20px' }}>Login Here</Typography>
                <TextField
                    required
                    variant='filled'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: '15px', width: '500px'}}
                />
                <TextField
                    required
                    variant='filled'
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: '15px', width: '500px'}}
                />
            <Box sx={{ margin: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant='contained' onClick={handleLoginClick} disabled={isLoginDisabled} sx={{ marginBottom: '15px', width: '120px'}}>Login</Button>
                <Button variant='text' size='small' onClick={handleRegisterClick}>Register Here</Button>
            </Box>
            </Box>
        </Box>          
    )
}