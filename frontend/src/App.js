import "./App.css";
import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Header from "./components/Header/Header";
import About from "./pages/About";

import Login from "./pages/Login";

import Builder from "./pages/Builder";
import WebsitesList from "./pages/WebsitesList";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

function App() {
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
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
