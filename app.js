require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/user');

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
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
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
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user input
        if(!(email && password)) {
            res.status(400).send("Please enter email and password");
        }

        const user = await User.findOne({ email });
        if (user) {
            if (await bcrypt.compare( password, user.password )) {
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    { expiresIn: "2h" }
                );

                user.token = token;
                res.status(200).json(user);
            }
            else {
                res.status(400).send("Wrong password")
            }
        }
        else {
            res.status(404).json("User not found");
        }
    }
    catch (err) {
        console.error(err);
    }
});

module.exports = app;