const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { MongoDuplicateError } = require('../errors/MongoDuplicateError');
const { UnАuthorizedError } = require('../errors/UnАuthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const CODE_OK_200 = 200;
const CODE_OK_201 = 201;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

// Обработка ошибок в асинхронном коде. Async/await
exports.getUsers = async (req, res, next) => {
  try {
    // Метод find возвращает все документы по запросу
    const users = await User.find({});
    res.status(CODE_OK_200).send(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    } else {
      res.status(CODE_OK_200).send(user);
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    // Метод findById возвращает документы найденные по id
    const user = await User.findById(req.params.userId);
    if (!user) {
      // если такого пользователя нет,
      // сгенерируем исключение
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    } else {
      res.status(CODE_OK_200).send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      // вызываем next с аргументом-ошибкой
      next(new BadRequestError('Некорректно переданы данные пользователя'));
    } else {
      next(err);
    }
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    if (user) {
      res.status(CODE_OK_201).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    }
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      // Обработка ошибки
      next(new MongoDuplicateError('Данный адресс эл. почты уже был зарегистрирован'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200).send({ token });
    }
  } catch (err) {
    next(new UnАuthorizedError('Ошибка авторизации'));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    } else {
      res.status(CODE_OK_200).send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    } else {
      next(err);
    }
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    } else {
      res.status(CODE_OK_200).send(updatedUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
    } else {
      next(err);
    }
  }
};
