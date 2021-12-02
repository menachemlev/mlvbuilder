import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LoadingIcon from "./../components/UI/LoadingIcon";
import Auth from "../Auth/Auth";
import "./Home.css";
function Home(props) {
  const ctx = useContext(Auth);
  const history = useHistory();
  const [portrait, setPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    setInterval(() => {
      setPortrait(window.innerHeight > window.innerWidth);
    }, 2000);
  }, []);

  const [loading, setLoading] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <div className="home">
        <div className="home__content-container">
          <h1>Build your website</h1>
          <h2>Easy, fast and free</h2>
          <button
            onClick={() => {
              ctx.logIn({
                email: "guest@mlvbuilder.com",
                password: "12345678",
                name: "guest",
              });
              setLoading(
                <>
                  <LoadingIcon style={{ color: "white" }} />
                </>
              );
              setTimeout(() => {
                history.push("/builder");
              }, 1000);
            }}
          >
            Builder
            <span>{" >"}</span>
          </button>
          {portrait && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
              }}
            >
              {ctx.loggedIn && (
                <Link className="home__link" to="/websites-list">
                  websites list
                </Link>
              )}
              {ctx.loggedIn ? (
                ctx.email === "guest@mlvbuilder.com" ? (
                  <Link className="home__link" to="/login">
                    Login
                  </Link>
                ) : (
                  <Link className="home__link" to="/account">
                    Account
                  </Link>
                )
              ) : (
                <Link className="home__link" to="/login">
                  Login
                </Link>
              )}
            </div>
          )}
          <div>{loading}</div>
        </div>
      </div>
    </>
  );
}

export default Home;
/* const interval = setInterval(() => {
      if (
        document.documentElement.scrollTop > 100 &&
        !document.documentURI.includes("websites-list") &&
        !document.documentURI.includes("login") &&
        !document.documentURI.includes("account") &&
        !document.documentURI.includes("builder")
      ) {
        ctx.logIn({
          email: "guest@mlvbuilder.com",
          password: "12345678",
          name: "guest",
        });
        setLoading(
          <>
            <LoadingIcon />
          </>
        );
        setTimeout(() => {
          clearInterval(interval);
          history.push("/builder");
        }, 200);
      }
    }, 200);
     <span className="home__scrolld">
            <b>Or scroll down</b>
            <br />{" "}
            <center>
              <KeyboardArrowDownSharpIcon />
            </center>
          </span>
                <Builder />

    */
