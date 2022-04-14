const express = require('express');
const { validateUserId, validateUserAvatar, validateUserUpdate } = require('../validation/validation');

const userRouter = express.Router();
const {
  getUsers, getUserById, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUser);
userRouter.get('/users/:userId', validateUserId, getUserById);
userRouter.patch('/users/me', validateUserUpdate, updateUser);
userRouter.patch('/users/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;
