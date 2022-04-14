import React from 'react';
import Header from './Header';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/api';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip'
import * as auth from '../utils/auth';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  //Hook авторизации пользователя
  const [loggedIn, setLoggedIn] = React.useState(false);
  //Hook состояния открытия popup с оповещением при авторизации
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  //Hook сообщения успеха / неудачи
  const [message, setMessage] = React.useState(false);
  //Hook получения email пользователя
  const [email, setEmail] = React.useState('');
  const history = useHistory();

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([currentUser, cardList]) => {
        setCurrentUser(currentUser);
        setCards(cardList);
      })
      .catch((err) =>
        console.log(`${err}`))
    }
  }, [loggedIn]);

  React.useEffect(()=>{
    function heandleEsc(evt){
      if(evt.key === "Escape"){
        closeAllPopups()
      }
    }

    document.addEventListener('keydown', heandleEsc)
      return () => {
        document.removeEventListener('keydown', heandleEsc);
      }
  }, [])

  React.useEffect(()=>{
    function heandleOverlay(evt){
      if(evt.target.classList.contains('popup')){
        closeAllPopups()
      }
    }
    document.addEventListener('mousedown', heandleOverlay)
      return () => {
        document.removeEventListener('mousedown', heandleOverlay);
      }
  }, [])
  
  function handleUpdateAvatar({ avatar }) {
    
    api.changeAvatar({ avatar })
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
    .catch((err) =>
    console.log(`Ошибка: ${err}`))
  }

  function handleUpdateUser({name, about}) {
    api.editUserInfo({name, about})
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
    .catch((err) =>
    console.log(`Ошибка: ${err}`))
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
  
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch((err) =>
    console.log(`Ошибка: ${err}`));
  }

  function handleCardDelete(card) {       
    api.deleteCard(card._id).then(() => { 
      setCards((state) => state.filter((c) => c._id !== card._id));
    }).catch((err) => console.log(`Ошибка: ${err}`)); 

  } 

  function handleAddPlaceSubmit({name, link}) {
    api.addNewCard({name, link})
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка: ${err}`))
  }

  function closeAllPopups(){
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false); 
    setAddPlacePopupOpen(false);
    setSelectedCard({name:'', link:''});
    setIsInfoTooltipOpen(false);
  }

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
  }

  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen) 
  }

  function handleAddPlaceClick(){
    setAddPlacePopupOpen(!isAddPlacePopupOpen)  
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleRegistr(email, password) {
    auth.register(email, password)
      .then(() => {
        handleInfoTooltip();
        setMessage(true);
        history.push('/sign-in');
      })
      .catch(() => {
        if (400) {
          console.log("400 - некорректно заполнено одно из полей");
        }
        handleInfoTooltip();
        setMessage(false);
      });
    }  

  function onLogin(email, password) {
    auth.login(email, password)
      .then((res) => {
        if(res) {
          setLoggedIn(true);
          setEmail(email);
          history.push('/');
          localStorage.setItem('token', res.id);
        }
      })
      .catch(() => {
        if(401){
          console.log("401 - пользователь с email не найден");
        }else if(400){
          console.log("400 - не передано одно из полей");
        }
        setMessage(false);
        handleInfoTooltip();
      });
  }

  //Hook для проверки токена
  React.useEffect(() => {
    //проверим существует ли токен в localStorage
    if (localStorage.getItem('jwt')) {
      auth.checkToken(localStorage.getItem('jwt'))
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/');
        })
        .catch(() => {
          console.log("401 — Переданный токен некорректен");
        });
    }
  }, [history]);

  function logout() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
    setLoggedIn(false);
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div>
      <div className="page">
          <Header email={email} logout={logout}/>
          <Switch>
          <ProtectedRoute
          exact path="/"
          component={Main}
          loggedIn={loggedIn}
          onEditAvatar={handleEditAvatarClick} 
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick} 
          onCardDelete={handleCardDelete}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onUpdateUser={handleUpdateUser}
          cards={cards}
          />
          <Route path="/sign-up">
            <Register onRegister={handleRegistr}/>
          </Route>
          <Route path="/sign-in">
            <Login onLogin={onLogin}/>
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up"/>}
          </Route>
          </Switch>

          <Footer />
      </div>
      
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

      <ImagePopup card = {selectedCard} onClose={closeAllPopups} />

      <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} status={message} />

    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
