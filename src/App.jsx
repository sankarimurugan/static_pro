// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter, } from 'react-router-dom';
import RegisterForm from './Screens/RegisterForm';
import Login from './Screens/Login';
import AdminPanel from './Screens/AdminPanel';
import './assets/styles/styles.css';
import { Provider } from 'react-redux';
import store from './Redux/store';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import UserPage from './Screens/UserPage';
import ProtectedRoute from './Screens/ProtectedRoute';



const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<UserPage />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
