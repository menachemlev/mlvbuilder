import { createContext, useEffect, useState } from "react";

const Auth = createContext({
  loggedIn: false,
  email: "",
  password: "",
  name: "",
  logIn: ({ email, password, name }) => {},
  logOut: () => {},
  fetchProviderURL: "",
  setShowHeader: () => {},
  showHeader: true,
});

export const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const fetchProviderURL = `${
    document.documentURI.includes("localhost")
      ? "http://localhost:8000"
      : "https://mlvbuilder.herokuapp.com"
  }/api`;

  const logIn = ({ email, password, name }) => {
    setName(name);
    setEmail(email);
    setPassword(password);
    setLoggedIn(true);
  };

  const logOut = () => {
    setEmail("");
    setPassword("");
    setName("");
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
        setShowHeader,
        showHeader,
      }}
    >
      {props.children}
    </Auth.Provider>
  );
};

export default Auth;
