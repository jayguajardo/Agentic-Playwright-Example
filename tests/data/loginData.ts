import { validUser } from './users';

export const wrongPasswordUser = {
  email: validUser.email,
  password: 'wrongpass',
};

export const messages = {
  invalidCredentials: 'Invalid credentials',
  loginToast: 'Login successful! Redirecting...',
  logoutToast: 'Logged out successfully',
  greeting: 'Hi, Demo User',
};

export const routes = {
  login: '/login.html',
  home: '/',
  currentUserApi: '/api/user',
};
