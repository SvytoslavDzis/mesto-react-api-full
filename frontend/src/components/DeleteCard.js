import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteCard({ onClose }) {
  //в разработке
  return (
    <PopupWithForm
      className="popup popup_type_delete-card"
      text="Да"
      title="Вы уверены?"
      onClose={onClose}
      name="card"
    />
  );
}

export default DeleteCard;
