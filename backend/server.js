const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const User = require('./model/User');

// Initialize the app and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend URL
  methods: ['GET', 'POST'], // Allow the necessary HTTP methods
  credentials: true // If you're using cookies or authorization headers
}))

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/locationTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Auth Routes
app.use('/api', authRoutes);

// WebSocket for Location Tracking
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Authentication middleware for WebSocket
  socket.on('authenticate', (token) => {
    jwt.verify(token, 'adesh', (err, decoded) => {
      if (err) {
        console.log('Authentication failed:', err);
        socket.emit('error', 'Authentication failed');
        socket.disconnect();
      } else {
        console.log('Authenticated user:', decoded.userId);
        socket.userId = decoded.userId; // Save user ID in socket object
      }
    });
  });

  // Handle Location Update
  socket.on('locationUpdate', async (data) => {
    console.log(`Location update from user ${socket.userId}:`, data);
    // You can save this location data to your database or process it further
    try {
      // Update the user's location in the database
      const updatedUser = await User.findByIdAndUpdate(
        socket.userId, // Find the user by ID
        {
          $set: { 'location.latitude': data.latitude, 'location.longitude': data.longitude },
        },
        { new: true } // Return the updated user document
      );

      if (updatedUser) {
        console.log('User location updated in MongoDB:', updatedUser.location);

        // You can emit the location update to other clients if needed
        io.emit('locationUpdated', {
          userId: socket.userId,
          location: updatedUser.location,
        });
      } else {
        console.log('User not found for location update');
      }
    } catch (err) {
      console.log('Error updating location:', err);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
