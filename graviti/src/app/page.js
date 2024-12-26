'use client';

import React, { useState, useEffect } from 'react';
import SignUpForm  from "../components/SignUpForm";
import SignInForm  from "../components/SignInForm";
import LocationTracker from '../components/LocationTracker';
import AdminDashboard from '../components/AdminDashboard'

export default function Home() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for token and admin status in localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Check if the user is an admin based on the token data
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      setIsAdmin(decodedToken.isAdmin); // Assuming the JWT includes isAdmin as part of the payload
    }
  }, []);

  return (
    <div>
      {!token ? (
        <>
          <SignUpForm />
          <SignInForm setToken={setToken} setIsAdmin={setIsAdmin} />
        </>
      ) : isAdmin ? (
        <AdminDashboard /> // Show admin dashboard to view all users and their locations
      ) : (
        <LocationTracker token={token} /> // Regular users track their location
      )}
    </div>
  );
}
