import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar:
        avatarRef.current.value /* Значение инпута, полученное с помощью рефа */,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Обновить аватар"
      text="Сохранить"
      name="avatar"
    >
      <input
        className="popup__input popup__input_type_url"
        type="url"
        id="avatar"
        required
        ref={avatarRef}
        name="avatar"
        placeholder="Ссылка на картинку"
      />
      <span className="error" id="avatar-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
