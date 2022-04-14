import logo from "./../images/Vector.svg";
import { Switch, Route, Link } from "react-router-dom";

function Header({email, logout }) {
  return (
    <header className="header">
      <img src={logo} alt="Место Россия" className="logo" />
      <Switch>
        <Route exact path="/sign-in">
          <Link to="/sign-up" className="header__menu-link">
            Регистрация
          </Link>
        </Route>
        <Route exact path="/sign-up">
          <Link to="/sign-in" className="header__menu-link">
            Войти
          </Link>
        </Route>
        <Route exact path="/">
          <div className="header__menu">
           <p className="header__menu-mail">{email}</p>
          <Link to='/sign-in' className="header__menu-link" onClick={logout}>Выйти</Link>
          </div>          
        </Route>
      </Switch>
    </header>
  );
}

export default Header;
