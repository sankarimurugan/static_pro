import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import credentials from '../Data/credentials.json';
import { toast } from 'react-toastify';

const Login = () => {
    const [cred, setCred] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = credentials.admin;

        if (cred.email === email && cred.password === password) {
            console.log('LOGIN OK → navigating');
            localStorage.setItem('isAdminLoggedIn', 'true');
            toast.success('Login successful');
            navigate('/admin');
        } else {
            toast.error('Wrong credentials');
        }
    };

    return (
        <div className="container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
