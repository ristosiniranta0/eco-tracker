/*
Filename: complexCode.js
Content: Complex JavaScript code demonstrating a web application with user authentication, database interactions, and real-time chat functionality.
*/

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

// Create the express application
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true })
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Failed to connect to database', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// API routes for user authentication
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'secretKey');

        res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Real-time chat functionality
const server = app.listen(3000, () => console.log('Server running on port 3000'));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});