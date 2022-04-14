const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

const CODE_OK_200 = 200;
const CODE_OK_201 = 201;

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(CODE_OK_200).send(cards);
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const сard = new Card({ name, link, owner: req.user._id });
    res.status(CODE_OK_201).send(await сard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        res.status(CODE_OK_200).send({ deletedCard });
      } else {
        throw new ForbiddenError('Недостаочно прав для удаления карточки');
      }
    } else {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Карточка с указанным _id не найдена.'));
    } else {
      next(err);
    }
  }
};

exports.likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findById(req.params.cardId);
    if (likedCard) {
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      );
      res.status(CODE_OK_200).send(likedCard);
    } else {
      throw new ForbiddenError('Передан несуществующий _id карточки.');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
    } else {
      next(err);
    }
  }
};

exports.dislikeCard = async (req, res, next) => {
  try {
    const dislikedCard = await Card.findById(req.params.cardId);
    if (dislikedCard) {
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      res.status(CODE_OK_200).send(dislikedCard);
    }
    throw new ForbiddenError('Передан несуществующий _id карточки.');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
    } else {
      next(err);
    }
  }
};
