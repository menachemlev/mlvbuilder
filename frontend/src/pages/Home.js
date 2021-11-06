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
    <div className="home">
      <h1>
        {ctx.loggedIn ? `ברוך שובך ${ctx.name || ""}` : "בנה את האתר שלך"}
      </h1>
      <h2>
        {ctx.loggedIn ? `לחץ בשביל לבנות את האתר שלך` : "בקלות, במהירות ובחינם"}
      </h2>

      <Link to={ctx.loggedIn ? "/builder" : "/login"}>
        <button>
          {ctx.loggedIn ? "לבונה" : "לכניסה"}
          <span>{" >"}</span>
        </button>
      </Link>
    </div>
  );
}

export default Home;
