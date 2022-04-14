const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // name — имя пользователя, строка от 2 до 30 символов, обязательное поле;
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  // link — ссылка на картинку, строка, обязательно поле.
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /https?:\/\/(w{3}\.)?[a-z0-9]{1,}([a-z-._~:/?#@!$&'()*+,;=]*)/g.test(link);
      },
    },
  },
  // owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // likes — список лайкнувших пост пользователей, массив ObjectId,
  // по умолчанию — пустой массив (поле default);
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  // createdAt — дата создания, тип Date, значение по умолчанию Date.now.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель card и экспортируем её
module.exports = mongoose.model('card', cardSchema);
