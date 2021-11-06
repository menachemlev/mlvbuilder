import "./App.css";
import React from "react";
import { useEffect, useContext } from "React";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header/Header";
import About from "./pages/About";

import { useParams } from "react-router-dom";

import Login from "./pages/Login";

import Builder from "./pages/Builder";
import WebsitesList from "./pages/WebsitesList";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import UserWebsite from "./pages/UserWebsite";
import Auth from "./Auth/Auth";

function App() {
  const params = useParams();
  const { login } = useContext(Auth);
  useEffect(() => {
    if (params.guest) {
      login("guest@mlvbuilder.com", "12345678", "guest");
    }
  }, [params]);
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
        <Route path="/w/:id?">
          <UserWebsite />
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
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
