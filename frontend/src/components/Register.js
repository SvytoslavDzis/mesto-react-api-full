
import  React from "react";
import { Link } from "react-router-dom";

function Register({onRegister}){
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onRegister(email, password);
    }


    return(
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__form-input"
          placeholder="Email"
          type="email"
          required
          value={email || ""}
          onChange={handleEmailChange}
        />
        <input
          className="auth__form-input"
          placeholder="Пароль"
          type="password"
          required
          value={password || ""}
          onChange={handlePasswordChange}
        />

        <button className="auth__form-submit auth__form-submit_size" type="submit">
          Зарегистрироваться
        </button>
        </form>
        
        <div className="auth__register">
          <p className="auth__register_text">Уже зарегистрированы?</p>
          <Link to="sign-in" className="auth__register_link">
            Войти
          </Link>
        </div>
    </div>
    )
}

export default Register;