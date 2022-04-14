const express = require('express');
const { validateCard, validateCardId } = require('../validation/validation');

const cardRouter = express.Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validateCard, createCard);
cardRouter.delete('/cards/:cardId', validateCardId, deleteCard);
cardRouter.put('/cards/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;
