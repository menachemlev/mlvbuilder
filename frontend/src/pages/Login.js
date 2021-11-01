import { useState, useContext, useEffect } from "react";
import SigninForm from "../components/Login/SigninForm";
import SignupForm from "../components/Login/SignupForm";
import Card from "./../components/UI/Card";
import Auth from "./../Auth/Auth";
import { useHistory } from "react-router-dom";
function Login(props) {
  const [signupMode, setSignupMode] = useState(false);
  const { loggedIn } = useContext(Auth);
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) history.push("/");
  }, []);

  return (
    <div className="login">
      <h1 className="pageTitle">Login</h1>

      <div
        style={{
          position: "absolute",
          boxSizing: "border-box",
          padding: "3rem",

          left: "50%",
          top: "30vh",
          transform: "translateX(-50%)",
        }}
      >
        <Card>{signupMode ? <SignupForm /> : <SigninForm />}</Card>
        {signupMode ? (
          <b
            onClick={() => setSignupMode(false)}
            style={{
              marginTop: "1rem",
              cursor: "pointer",
              color: "#333",
              textDecoration: "underline",
            }}
          >
            Already signed up? Sign in
          </b>
        ) : (
          <b
            onClick={() => setSignupMode(true)}
            style={{
              marginTop: "1rem",
              cursor: "pointer",
              color: "#333",
              textDecoration: "underline",
            }}
          >
            Not signed up? Sign up{" "}
          </b>
        )}
      </div>
    </div>
  );
}

export default Login;
