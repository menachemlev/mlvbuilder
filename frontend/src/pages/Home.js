import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import background from "./../photos/background.jpg";

import Auth from "../Auth/Auth";
import "./Home.css";
function Home(props) {
  const ctx = useContext(Auth);
  const history = useHistory();
  const [loading, setLoading] = useState("");
  useEffect(() => {
    [...document.querySelectorAll("#signature path")].forEach((path, delay) => {
      setTimeout(() => {
        path.style.strokeWidth = "4";
      }, delay / 10);
    });
  }, []);
  return (
    <div className="home">
      <div className="home__content-container">
        <h1>
          {ctx.loggedIn && ctx.name !== "guest"
            ? `Welcome back ${ctx.name || ""}`
            : "Build your website"}
        </h1>
        <h2>
          {ctx.loggedIn && ctx.name !== "guest"
            ? `Start building your website`
            : "Easy, fast & free"}
        </h2>
        <Link to={ctx.loggedIn ? "/builder" : "/login"}>
          <button>
            {ctx.loggedIn ? "Builder" : "Login"}
            <span>{" >"}</span>
          </button>
        </Link>
        {!ctx.loggedIn && (
          <button
            style={{ fontSize: "1em" }}
            onClick={() => {
              setLoading("⏳ Getting you in... ");
              setTimeout(() => {
                ctx.logIn({
                  email: "guest@mlvbuilder.com",
                  password: "12345678",
                  name: "guest",
                });
                setLoading("");
              }, 1000);
            }}
          >
            Be a guest
          </button>
        )}
        <b>{loading}</b>
      </div>
    </div>
  );
}

export default Home;
