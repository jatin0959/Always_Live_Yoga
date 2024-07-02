
const express = require('express');
const { home, registerUser, profile, registerWithRefrence, leaderboard, logout, login, userLogin } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', home)

userRouter.post('/register', registerUser)

userRouter.get('/profile', profile)

userRouter.get('/register/:referrer', registerWithRefrence)

userRouter.get('/leaderboard/:id', leaderboard)

userRouter.get('/logout', logout)

userRouter.get('/login', login)

userRouter.post('/login', userLogin)








module.exports = userRouter