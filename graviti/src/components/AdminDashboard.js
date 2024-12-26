import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4000/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Store fetched users in state
      } else {
        console.error('Failed to fetch users');
      }
    };

    fetchUsers();

    // Set up WebSocket connection to listen for location updates
    const socket = io('http://localhost:4000', {
      auth: {
        token: localStorage.getItem('authToken'),
      },
    });

    // Listen for 'locationUpdated' event from the server
    socket.on('locationUpdated', (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser.userId
            ? { ...user, location: updatedUser.location }
            : user
        )
      );
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>All Users and Their Locations</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <div>
              <p>Username: {user.username}</p>
              <p>
                Location: {user.location.latitude}, {user.location.longitude}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
