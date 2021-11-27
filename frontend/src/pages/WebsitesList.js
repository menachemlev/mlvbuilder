import "./WebsitesList.css";

import LoadingIcon from "./../components/UI/LoadingIcon";
import { useContext, useState, useEffect } from "react";
import Auth from "./../Auth/Auth";
import WebsiteWidget from "../components/WebsitesList/WebsiteWidget";
import { useHistory } from "react-router-dom";
function WebsitesList(props) {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const ctx = useContext(Auth);
  const history = useHistory();
  const { password, email } = ctx;
  useEffect(() => {
    if (!ctx.loggedIn) history.push("/");
  }, []);
  useState(() => {
    setLoading(true);
    fetch(`${ctx.fetchProviderURL}/web/list`, {
      method: "POST",
      body: JSON.stringify({ password, email }),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        setWebsites(response.data.websitesList);
      })
      .catch((err) => {
        console.error(err);
      });
    setLoading(false);
  }, []);
  return (
    <div className="websites-list">
      <h1 className="pageTitle">Websites list</h1>
      {websites.map((website) => {
        return <WebsiteWidget key={Math.random() * 100000} website={website} />;
      })}
      {loading && <LoadingIcon />}
    </div>
  );
}

export default WebsitesList;
