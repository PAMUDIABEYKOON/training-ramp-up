import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { Provider } from 'react-redux';
import store from '../../redux/store';

jest.mock('axios');
jest.mock('../../api/authApi', () => ({
  userAuthenticatedApi: jest.fn(),
}));

it('disables register button when required fields are empty', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const registerButton = screen.getByText('Register');
  expect(registerButton).toBeDisabled();
});

it('displays an alert for invalid emails', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'usero.com'}})
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123'}})
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123'}})
  
  const alertMock = jest.spyOn(window, 'alert');
  fireEvent.click(screen.getByText('Register'));

  expect(alert).toHaveBeenCalledWith('Invalid email');
  alertMock.mockRestore();
});

it('displays an alert for passwords that do not match', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@yahoo.com'}})
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123'}})
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '147'}})
  
  const alertMock = jest.spyOn(window, 'alert');
  fireEvent.click(screen.getByText('Register'));

  expect(alert).toHaveBeenCalledWith('Passwords do not match');
  alertMock.mockRestore();
});

it('displays an alert for passwords that do not have more than 5 characters', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@yahoo.com'}})
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123'}})
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123'}})
  
  const alertMock = jest.spyOn(window, 'alert');
  fireEvent.click(screen.getByText('Register'));

  expect(alert).toHaveBeenCalledWith('Password should contain at least 6 characters');
  alertMock.mockRestore();
});

it('navigates to login page', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  const loginButton = screen.getByText('Already have an account?');
  fireEvent.click(loginButton);
});