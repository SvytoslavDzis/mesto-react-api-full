function PopupWithForm({
  title,
  name,
  children,
  isOpen,
  onClose,
  text,
  onSubmit,
}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__button-close"
          onClick={onClose}
        ></button>
        <form
          action="#"
          name={name}
          onSubmit={onSubmit}
          className={`popup__form popup__form_${name}`}
        >
          <h2 className="popup__title">{title}</h2>
          {children}
          <button className="popup__button-save" type="submit">
            {text}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
