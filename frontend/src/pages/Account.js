import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auth from "./../Auth/Auth";
import "./Account.css";

import AdminAccess from "../components/Account/AdminAccess";
import { isItMobile } from "./../components/Builder/util/generalFunctions";

function Account(props) {
  const ctx = useContext(Auth);
  const history = useHistory();
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const [portrait, setPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    setInterval(() => {
      setPortrait(window.innerHeight > window.innerWidth);
    }, []);
  }, []);

  const [users, setUsers] = useState([]);
  const fetchUsers = () => {
    fetch(`${ctx.fetchProviderURL}/admin`, {
      method: "POST",
      body: JSON.stringify({
        email: ctx.email,
        password: ctx.password,
      }),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((data) => {
        setUsers(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteAccount = () => {
    if (message !== "Are you sure?") return setMessage("Are you sure?");
    setTimeout(() => {
      fetch(`${ctx.fetchProviderURL}/users/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          email: ctx.email,
          password: ctx.password,
        }),
        headers: {
          "Content-type": "Application/json",
        },
      })
        .then((res) => {
          if (!res) throw new Error("Something went wrong...");
          return res.json();
        })
        .then((response) => {
          if (response.status === "fail") throw new Error(response.message);
          setMessage("Deleting account...");
          setTimeout(() => {
            history.push("/");
            ctx.logOut();
          }, 1000);
        })
        .catch((err) => {
          setError(err.message);
        });
    }, 1000);
  };
  //Set admin access
  useEffect(() => {
    if (!ctx.loggedIn) history.push("/login");
    fetchUsers();
  }, []);

  return (
    <div className="account">
      <h1 className="pageTitle">Account</h1>
      <center>
        <button
          onClick={() => {
            setMessage("Logging out...");
            setTimeout(() => {
              ctx.logOut();
              history.push("/");
            }, 1000);
          }}
        >
          Logout
        </button>
        {ctx.name !== "guest" && (
          <button onClick={deleteAccount}>Delete</button>
        )}
        {message}
        <div style={{ color: "red" }}>{error}</div>
        <br />
        <br />
        {users.length > 0 && portrait ? (
          <p>Landspace your phone to view admin panel</p>
        ) : (
          users.length > 0 && (
            <AdminAccess onchange={fetchUsers} users={users} />
          )
        )}
        <br />
        <br />
      </center>
    </div>
  );
}

export default Account;
