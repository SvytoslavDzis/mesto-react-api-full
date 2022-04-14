const express = require('express');
const { NotFoundError } = require('../errors/NotFoundError');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const router = express.Router();

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден.'));
});

module.exports = router;
