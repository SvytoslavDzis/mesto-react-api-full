import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [cardName, setCardName] = React.useState("");
  const [cardLink, setCardLink] = React.useState("");

  function handleChangeCardName(evt) {
    setCardName(evt.target.value);
  }

  function handleChangeCardLink(evt) {
    setCardLink(evt.target.value);
  }

  React.useEffect(() => {
    setCardName("");
    setCardLink("");
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace({
      name: cardName,
      link: cardLink,
    });
  }

  return (
    <PopupWithForm
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      text="Создать"
      name="addPicture"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        onChange={handleChangeCardName}
        required
        placeholder="Название"
        className="popup__input popup__input_type_name"
        minLength="2"
        maxLength="30"
        autoComplete="off"
        id="title"
        value={cardName}
        name="title"
      />
      <span className="error" id="title-error"></span>

      <input
        type="url"
        onChange={handleChangeCardLink}
        required
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_type_link"
        autoComplete="off"
        id="link"
        value={cardLink}
        name="url"
      />
      <span className="error" id="link-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
