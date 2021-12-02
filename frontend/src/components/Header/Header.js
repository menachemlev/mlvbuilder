import "./Header.css";
import { NavLink } from "react-router-dom";
import Logo from "./logo.png";
import { useContext, useEffect, useState } from "react";
import Auth from "./../../Auth/Auth";
function Header(props) {
  const { loggedIn, email } = useContext(Auth);
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
            Home
          </NavLink>
        )}
        {!portrait && (
          <>
            {(!loggedIn || email === "guest@mlvbuilder.com") && (
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
                  Websites
                </NavLink>
                {email !== "guest@mlvbuilder.com" && (
                  <NavLink
                    className="link"
                    activeClassName="active"
                    to="/account"
                  >
                    Account
                  </NavLink>
                )}
                <NavLink
                  className="link"
                  activeClassName="active"
                  to="/builder"
                >
                  Builder
                </NavLink>
              </>
            )}
          </>
        )}
      </div>
      <div style={{ background: "transparent" }} className="logo-box">
        <NavLink style={{ background: "transparent" }} to="/">
          <img
            className="logo"
            style={{
              width: `3rem`,
              margin: `${portrait ? "2rem 0 0 0" : "0 4rem 0 0"}`,
              transform: "scale(3,3) translateY(-10%)",
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
