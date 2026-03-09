import axios from 'axios';

export const getUser = () =>
  localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

export const login = async (email, password) => {
  const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const register = async registerData => {
  const { data } = await axios.post('http://localhost:5000/api/users/register', registerData);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const updateProfile = async user => {
  const { data } = await axios.put('http://localhost:5000/api/users/updateProfile', user);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const changePassword = async passwords => {
  await axios.put('http://localhost:5000/api/users/changePassword', passwords);
};

export const getAll = async searchTerm => {
  const { data } = await axios.get('http://localhost:5000/api/users/getAll/' + (searchTerm ?? ''));
  return data;
};

export const toggleBlock = async userId => {
  const { data } = await axios.put('http://localhost:5000/api/users/toggleBlock/' + userId);
  return data;
};

export const getById = async userId => {
  const { data } = await axios.get('http://localhost:5000/api/users/getById/' + userId);
  return data;
};

export const updateUser = async userData => {
  const { data } = await axios.put('http://localhost:5000/api/users/update', userData);
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
};