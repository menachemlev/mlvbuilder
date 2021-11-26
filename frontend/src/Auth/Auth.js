import { createContext, useEffect, useState } from "react";

const Auth = createContext({
  loggedIn: false,
  email: "",
  password: "",
  name: "",
  logIn: ({ email, password, name }) => {},
  logOut: () => {},
  fetchProviderURL: "",
});

export const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const fetchProviderURL = `${
    document.documentURI.includes("localhost")
      ? "http://localhost:8000"
      : "https://mlvbuilder.herokuapp.com"
  }/api`;
  useEffect(() => {
    if (typeof localStorage === undefined) return;
    if (!localStorage.getItem("loginData")) return;
    const { email, password, date, name } = JSON.parse(
      localStorage.getItem("loginData")
    );
    if (Date.now() > date + 90 * 24 * 60 * 60 * 1000) return logOut(); //30 days

    fetch(`${fetchProviderURL}/users/auto-login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong...");
        return res.json();
      })
      .then((res) => logIn({ email, password, name }))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const logIn = ({ email, password, name }) => {
    setName(name);
    setEmail(email);
    setPassword(password);
    setLoggedIn(true);
    if (typeof localStorage === undefined) return;
    localStorage.setItem(
      "loginData",
      JSON.stringify({ email, password, name, date: Date.now() })
    );
  };
  const logOut = () => {
    setEmail("");
    setPassword("");
    setName("");
    localStorage.removeItem("loginData");
    setLoggedIn(false);
  };

  return (
    <Auth.Provider
      value={{
        loggedIn,
        logIn,
        logOut,
        email,
        password,
        name,
        fetchProviderURL,
      }}
    >
      {props.children}
    </Auth.Provider>
  );
};

export default Auth;
