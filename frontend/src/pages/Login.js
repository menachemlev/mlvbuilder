import { useState, useContext, useEffect } from "react";
import SigninForm from "../components/Login/SigninForm";
import SignupForm from "../components/Login/SignupForm";
import Card from "./../components/UI/Card";
import Auth from "./../Auth/Auth";
import { useHistory } from "react-router-dom";
function Login(props) {
  const [signupMode, setSignupMode] = useState(false);
  const { loggedIn, email } = useContext(Auth);
  const history = useHistory();

  useEffect(() => {
    if (loggedIn && email !== "guest@mlvbuilder.com") history.push("/");
  }, []);

  return (
    <div className="login">
      <div
        style={{
          animation: "fadeInComponent 1s",
          position: "absolute",
          boxSizing: "border-box",
          padding: "3em",
          overflow: "hidden",
          left: "50%",
          top: "15vh",
          width: "100%",
          minHeight: "50vh",
          transform: "translateX(-50%)",
        }}
      >
        <Card>{signupMode ? <SignupForm /> : <SigninForm />}</Card>

        <b
          onClick={() => setSignupMode((prev) => !prev)}
          style={{
            marginTop: "1em",
            cursor: "pointer",
            color: "#333",
            textDecoration: "underline",
            background: "white",
            padding: "2px",
            display: "inline-block",
          }}
        >
          {signupMode ? "Already signed up? Sign in" : "Not signed up? Sign up"}
        </b>
      </div>
    </div>
  );
}

export default Login;
