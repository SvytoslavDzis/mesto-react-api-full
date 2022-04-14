const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // name — имя пользователя, строка от 2 до 30 символов, обязательное поле;
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  // about — информация о пользователе, строка от 2 до 30 символов, обязательное поле;
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь океана',
  },
  // avatar — ссылка на аватарку, строка, обязательное поле.
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?[a-z0-9]{1,}([a-z-._~:/?#@!$&'()*+,;=]*)/g.test(v);
      },
    },
  },
  email: {
    type: String,
    required: true,
    // Добавление свойства unique со значением true.
    // Так в базе не окажется несколько пользователей с одинаковой почтой.
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  // попытаемся найти пользователя по почте
  const user = await this.findOne({ email }).select('+password');
  // не нашёлся — отклоняем промис
  if (!user) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  // нашёлся — сравниваем хеши
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) { // отклоняем промис
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  return user;
};

// создаём модель user и экспортируем её
module.exports = mongoose.model('user', userSchema);
