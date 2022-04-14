require("dotenv").config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const router = require('./routes');
const { InternalServerError } = require('./errors/InternalServerError');
const { login, createUser } = require('./controllers/users');
const { validateSigUp, validateSigIn } = require('./validation/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Cookie'],
  credentials: true,
}));

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSigIn, login);
app.post('/signup', validateSigUp, createUser);
app.use(auth);// все роуты ниже этой строки будут защищены авторизацией
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(InternalServerError);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
