export const profileOpenButton = document.querySelector('.profile__edit-button');
export const popupFormProfile = document.querySelector('.popup__form_profile');
export const nameInput = popupFormProfile.querySelector('.popup__input_user_name');
export const jobInput = popupFormProfile.querySelector('.popup__input_user_job');

export const avatarOpenButton = document.querySelector('.profile__avatar-button');
export const popupFormTypeAvatar = document.querySelector('.popup__form_type_avatar');

export const cardOpenButton = document.querySelector('.profile__add-button');
export const popupFormImg = document.querySelector('.popup__form_img');
export const typeName = document.querySelector(".popup__input_type_name");
export const typeLink = document.querySelector(".popup__input_type_link");

//export const popupButtonSave = document.querySelector('.popup__button-save');
//export const popupButtonImg = document.querySelector('.popup__button-img');


export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button-save',
  inactiveButtonClass: 'popup__button-save_invalid',
  inputErrorClass: 'popup__input_state_invalid'
}
