import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";
import Auth from "./../../Auth/Auth";
function SignupForm(props) {
  const history = useHistory();

  const ctx = useContext(Auth);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordCofirmValid, setPasswordConfirmValid] = useState(false);
  const [emailInputChanged, setEmailInputChanged] = useState(false);
  const [passwordInputChanged, setPasswordInputChanged] = useState(false);
  const [passwordConfirmInputChanged, setPasswordConfirmInputChanged] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const email = useRef(null);
  const name = useRef(null);
  const password = useRef(null);
  const passwordConfirm = useRef(null);

  const emailNotValidMessage = `Email is not valid!`;
  const passwordNotValidMessage = `Password is not valid (Should be atleast 8 characters)!`;
  const passwordConfirmNotValidMessage = `Password confirm is not valid (Should be atleast 8 characters and matches the password)!`;

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

  const handleOnPasswordConfirmChange = () => {
    setPasswordConfirmInputChanged(true);
    setPasswordConfirmValid(
      passwordConfirm.current.value.length >= 8 &&
        passwordConfirm.current.value === password.current.value
    );
  };

  const handleOnInputBlur = () => {
    //HANDLING DISPLAYING ERRORS

    const emailError =
      emailInputChanged && !emailValid ? emailNotValidMessage : "";
    const passwordError =
      passwordInputChanged && !passwordValid ? passwordNotValidMessage : "";
    const passwordConfirmError =
      passwordConfirmInputChanged && !passwordCofirmValid
        ? passwordConfirmNotValidMessage
        : "";

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
        {passwordConfirmError && (
          <>
            {passwordConfirmError}
            <br />
          </>
        )}
      </>
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailValid || !passwordValid || !passwordCofirmValid) return;
    fetch(`${ctx.fetchProviderURL}/users/signup`, {
      method: "POST",
      body: JSON.stringify({
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
        passwordConfirm: passwordConfirm.current.value,
      }),
      headers: { "Content-type": "Application/json" },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong...");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        ctx.logIn({
          email: email.current.value,
          password: password.current.value,
          name: name.current.value,
        });
        setMessage("Signend up successfully! Redirecting to home page...");
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
        <label for="nameInput">Your full name</label>
        <input ref={name} id="nameInput" type="text" placeholder="Your name" />
      </div>
      <div>
        <label for="emailInput" onChange={handleOnEmailChange} required>
          *Your email
        </label>

        <input
          className={`
            ${!emailValid && emailInputChanged ? "invalid" : ""}
          `}
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
      <div>
        <label htmlFor="passwordConfirmInput">*Confirm password</label>
        <input
          className={`${
            !passwordCofirmValid && passwordConfirmInputChanged ? "invalid" : ""
          }
          `}
          ref={passwordConfirm}
          onChange={handleOnPasswordConfirmChange}
          onBlur={handleOnInputBlur}
          id="passwordConfirmInput"
          type="password"
          required
        />
      </div>
      <div>{message}</div>
      <div style={{ color: "red" }}>{error}</div>
      <div>
        <button>Sign up</button>
      </div>
    </form>
  );
}

export default SignupForm;
