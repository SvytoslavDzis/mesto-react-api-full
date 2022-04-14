import React from "react";

function Login(props) {
    const [email, setEmail] = React.useState("");
    const [password, setpassword] = React.useState("");
  
    function handleEmailChange(e) {
      setEmail(e.target.value);
    }
    function handlePasswordChange(e) {
      setpassword(e.target.value);
    }
  
    function handleSubmit(e) {
      e.preventDefault();
      props.onLogin(email, password);
    }
  
    return (
        <div className="auth">
          <h2 className="auth__title">Вход</h2>
          <form className="auth__form" onSubmit={handleSubmit}>
            <input
              onChange={handleEmailChange}
              className="auth__form-input"
              placeholder="Email"
              type="email"
              required
              value={email || ""}
            />
            <input
              onChange={handlePasswordChange}
              className="auth__form-input"
              placeholder="Пароль"
              type="password"
              required
              value={password || ""}
            />
  
            <button className="auth__form-submit" type="submit">
              Войти
            </button>
          </form>
        </div>
        
    );
}
export default Login;