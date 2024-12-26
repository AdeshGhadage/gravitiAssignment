import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000'; // Replace with your backend URL

const SignInForm = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/signin`, formData);
      localStorage.setItem('authToken', response.data.token);
      setMessage('Sign In Successful!');
    } catch (error) {
      setMessage('Sign In Failed!');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign In</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SignInForm;
