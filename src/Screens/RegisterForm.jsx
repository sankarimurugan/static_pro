import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../Redux/Slice/userSlice';   
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
    toast.success('Registered successfully!');
    setForm({ username: '', email: '', password: '' }); // Clear inputs
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} value={form.username} />
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
        <button type="submit">Register</button>
      </form>
     
    </div>
  );
};

export default RegisterForm;
