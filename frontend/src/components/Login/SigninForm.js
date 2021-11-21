import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Auth from "./../../Auth/Auth";
import "./Login.css";

function SigninForm(props) {
  const ctx = useContext(Auth);
  const history = useHistory();
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailInputChanged, setEmailInputChanged] = useState(false);
  const [passwordInputChanged, setPasswordInputChanged] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = useRef(null);
  const password = useRef(null);

  const emailNotValidMessage = `Email is not valid!`;
  const passwordNotValidMessage = `Password is not valid (Should be atleast 8 characters)!`;

  const handleOnEmailChange = () => {
    setEmailInputChanged(true);
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    setEmailValid(re.test(email.current.value));
  };

  const handleOnPasswordChange = () => {
    setPasswordInputChanged(true);
    setPasswordValid(password.current.value.length >= 8);
  };

  const handleOnInputBlur = () => {
    //HANDLING DISPLAYING ERRORS

    const emailError =
      emailInputChanged && !emailValid ? emailNotValidMessage : "";
    const passwordError =
      passwordInputChanged && !passwordValid ? passwordNotValidMessage : "";
    setError(
      <>
        {emailError && (
          <>
            {emailError}
            <br />
          </>
        )}
        {passwordError && (
          <>
            {passwordError}
            <br />
          </>
        )}
      </>
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailValid || !passwordValid) return;
    fetch(`${ctx.fetchProviderURL}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
      headers: { "Content-type": "Application/json" },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong...");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        const { name } = response;

        ctx.logIn({
          email: email.current.value,
          password: password.current.value,
          name,
        });
        setMessage("You successfully logged in! Redirecting...");
        setTimeout(() => {
          history.push("/");
        }, 1000);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        {" "}
        <label htmlFor="emailInput" onChange={handleOnEmailChange} required>
          *Your email
        </label>
        <input
          className={`${!emailValid && emailInputChanged ? "invalid" : ""}`}
          ref={email}
          id="emailInput"
          type="email"
          placeholder="Your E-mail"
          onChange={handleOnEmailChange}
          onBlur={handleOnInputBlur}
        />
      </div>
      <div>
        <label for="passwordInput">*Password</label>
        <input
          className={`
            ${!passwordValid && passwordInputChanged ? "invalid" : ""}
          `}
          ref={password}
          id="passwordInput"
          onChange={handleOnPasswordChange}
          onBlur={handleOnInputBlur}
          type="password"
          required
        />
      </div>
      <div></div>
      <div>
        <button>Sign in</button>
      </div>
      <div>{message}</div>
      <div style={{ color: "red" }}>{error}</div>
    </form>
  );
}

export default SigninForm;
