import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      text="Сохранить"
      name="editProfile"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        required
        name="name"
        placeholder="ФИО"
        className="popup__input popup__input_user_name"
        minLength="2"
        maxLength="40"
        autoComplete="off"
        onChange={handleNameChange}
        value={name || ""}
        id="user-name"
      />
      <span className="error" id="user-name-error"></span>

      <input
        type="text"
        required
        name="about"
        placeholder="Профессия"
        className="popup__input popup__input_user_job"
        minLength="2"
        maxLength="200"
        autoComplete="off"
        value={description || ""}
        onChange={handleDescriptionChange}
        id="user-job"
      />
      <span className="error" id="user-job-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
