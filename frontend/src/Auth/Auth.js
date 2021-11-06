import { createContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

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
  const history = useHistory();
  const params = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const fetchProviderURL = "https://mlvbuilder.herokuapp.com";
  useEffect(() => {
    let email = "guest@mlvbuilder.com",
      password = "12345678";
    if (!params.guest) {
      if (typeof localStorage === undefined) return;
      if (!localStorage.getItem("loginData")) return;
      const localStorageData = JSON.parse(localStorage.getItem("loginData"));
      const date = localStorageData.date;
      email = localStorageData.email;
      password = localStorage.password;
      if (Date.now() > date + 90 * 24 * 60 * 60 * 1000) return logOut(); //30 days
    }
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
