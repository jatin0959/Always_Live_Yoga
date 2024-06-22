
const express = require('express');
const { home, registerUser, profile, registerWithRefrence, leaderboard } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', home)

userRouter.post('/register', registerUser)

userRouter.get('/profile', profile)

userRouter.get('/register/:referrer', registerWithRefrence)

userRouter.get('/leaderboard/:id', leaderboard)





module.exports = userRouter