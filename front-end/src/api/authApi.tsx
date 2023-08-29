import axios, { AxiosError } from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:4000',
});

export const registerApi = async (
  username: String,
  password: String,
  role: String,
) => {
  try {
    const response = await apiInstance.post('/register', {
      username,
      password,
      role,
    });
    console.log(response.data.message);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      throw new Error('User already exists');
    } else {
      console.log('An error occurred:', axiosError.message);
    }
  }
};

export const loginApi = async (username: String, password: String) => {
  try {
    const response = await apiInstance.post('/login', {
      username,
      password,
    });
    console.log(response.data.message);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      console.log(axiosError.response.data);
    } else {
      console.log('An error occurred:', axiosError.message);
    }
  }
};

export const userAuthenticatedApi = async () => {
  try {
    const response = await apiInstance.get('/userAuth', {
      headers: { 'access-token': localStorage.getItem('token') },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const logoutApi = async () => {
  const response = await apiInstance.post('/logout');
  return response.data;
};
