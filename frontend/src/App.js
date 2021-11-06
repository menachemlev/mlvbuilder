import "./App.css";
import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router";

import Home from "./pages/Home";
import Header from "./components/Header/Header";
import About from "./pages/About";

import Login from "./pages/Login";

import Builder from "./pages/Builder";
import WebsitesList from "./pages/WebsitesList";
import Account from "./pages/Account";
//import Guest from "./pages/Guest";
import NotFound from "./pages/NotFound";
import Auth from "./Auth/Auth";

function App() {
  const { login } = useContext(Auth);
  const history = useHistory();
  return (
    <div className="app">
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/builder/:id?">
          <Builder />
        </Route>
        <Route path="/websites-list">
          <WebsitesList />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/guest1">
          <center>
            <br />
            <button
              className="guestButton"
              onClick={() => {
                login("guest@mlvbuilder.com", "12345678", "guest");
                setTimeout(() => {
                  history.push("/");
                }, 1000);
              }}
            >
              Log in as a guest
            </button>
          </center>
        </Route>
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
