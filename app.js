require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('./model/user');

const app = express();

app.use(express.json());

// Register
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validating user input
        if (!(email && password && firstName && lastName)) {
            res.status(400).send("all fields are required");
        }

        // Check if emil in db
        const existingUser = await user.findOne({ email }).exec();
        if (existingUser) {
            res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = jwt.sign(
            { user_id: newUser._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        );

        newUser.token = token;

        res.status(201).json(newUser);
    } 
    catch (err) {
        console.error(err);
    } 
});

// Login
app.post('/login', (req, res) => {

});

module.exports = app;