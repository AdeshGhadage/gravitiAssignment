import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:4000'; // Replace with your backend URL

const LocationTracker = () => {
  useEffect(() => {
    // Check if a token exists in localStorage
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      console.log('No token found, cannot connect to socket.');
      return; // If no token, do not attempt to connect to the socket
    }

    const socket = io(BACKEND_URL, {
      auth: { token: storedToken }, // Send token for authentication
    });

    // Emit the authenticate event with the token
    socket.emit('authenticate', storedToken);  // Emit token for authentication

    // Function to generate random latitude and longitude
    const generateRandomLocation = () => {
      // Simulating location within a range
      const randomLatitude = 20 + Math.random() * 10; // Between 20° and 30° N
      const randomLongitude = 75 + Math.random() * 10; // Between 75° and 85° E

      return { latitude: randomLatitude, longitude: randomLongitude };
    };

    const sendLocation = () => {
      const { latitude, longitude } = generateRandomLocation();
      socket.emit('locationUpdate', { latitude, longitude });
    };

    const interval = setInterval(sendLocation, 4000); // Every 4 seconds

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []); // Empty dependency array to ensure it runs once

  return <div><h2>Tracking Location...</h2></div>;
};

export default LocationTracker;
