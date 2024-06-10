const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.send('Registration successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
