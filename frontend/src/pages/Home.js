import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import background from "./../photos/background.jpg";

import Auth from "../Auth/Auth";
import "./Home.css";
function Home(props) {
  const ctx = useContext(Auth);
  useEffect(() => {
    [...document.querySelectorAll("#signature path")].forEach((path, delay) => {
      setTimeout(() => {
        path.style.strokeWidth = "4";
      }, delay / 10);
    });
  }, []);
  return (
    <div className="home" style={{ background: `url${background}` }}>
      <h1>
        {ctx.loggedIn ? `Welcome back ${ctx.name || ""}` : "Build your website"}
      </h1>
      <h2>
        {ctx.loggedIn ? `Start building your website` : "Easy, fast & free"}
      </h2>

      <Link to={ctx.loggedIn ? "/builder" : "/login"}>
        <button>
          {ctx.loggedIn ? "Builder" : "Login"}
          <span>{" >"}</span>
        </button>
      </Link>
    </div>
  );
}

export default Home;
