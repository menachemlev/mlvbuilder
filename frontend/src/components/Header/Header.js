import "./Header.css";
import { NavLink } from "react-router-dom";
import Logo from "./logo.png";
import { useContext, useEffect, useState } from "react";
import Auth from "./../../Auth/Auth";
function Header(props) {
  const { loggedIn } = useContext(Auth);
  const [portrait, setPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    setInterval(() => {
      setPortrait(window.innerHeight > window.innerWidth);
    }, 2000);
  }, []);

  return (
    <header className={`header ${portrait ? "header_on_portrait" : ""}`}>
      <div className="navigator">
        {!portrait && (
          <NavLink className="link" activeClassName="active" to="/" exact>
            🏠
          </NavLink>
        )}
        {!loggedIn && (
          <NavLink className="link" activeClassName="active" to="/Login">
            Login
          </NavLink>
        )}
        {loggedIn && (
          <>
            <NavLink
              className="link"
              activeClassName="active"
              to="/websites-list"
            >
              {`${portrait ? "List" : "Websites List"}`}
            </NavLink>
            <NavLink className="link" activeClassName="active" to="/account">
              Account
            </NavLink>
            <NavLink className="link" activeClassName="active" to="/builder">
              Builder
            </NavLink>
          </>
        )}
      </div>
      <div className="logo-box">
        <NavLink to="/">
          <img
            className="logo"
            style={{
              width: `${portrait ? "3rem" : "1.5rem"}`,
              margin: `${portrait ? "2rem 0 0 0" : " 0 2rem 0 0"}`,
            }}
            alt=""
            src={Logo}
          />
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
