import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingIcon from "./../components/UI/LoadingIcon";

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
                <LoadingIcon />
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

        <div>{loading}</div>
      </div>
    </div>
  );
}

export default Home;
