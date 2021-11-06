import "./App.css";
import React from "react";
import { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header/Header";
import About from "./pages/About";

import Login from "./pages/Login";

import Builder from "./pages/Builder";
import WebsitesList from "./pages/WebsitesList";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Auth from "./Auth/Auth";

function App() {
  /* useEffect(() => {
    if (params.guest && !ctx.loggedIn) {
      ctx.login("guest@mlvbuilder.com", "12345678", params.guest);
    }
  }, [params]);
  <Route path="/guest/:guest?">
          <Home />
        </Route>
  */
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
      </Switch>
    </div>
  );
}

export default App;
