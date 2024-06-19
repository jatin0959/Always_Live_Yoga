
const express = require('express');
const { home, registerUser, profile, registerWithRefrence } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', home)

userRouter.post('/register', registerUser)

userRouter.get('/profile/:id', profile)

userRouter.get('/register/:referrer', registerWithRefrence)




module.exports = userRouter