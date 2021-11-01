import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./WebsiteWidget.css";
import Auth from "./../../Auth/Auth";
function WebsiteWidget(props) {
  const { html, _id } = props.website;
  const srcdoc = `
  <style>
  .landspace{display:block}
  .portrait{display:none}
  </style>
  ${html.replace(/&lt;/g, "<")}`;

  return (
    <div className="iframe-widget">
      <iframe title={_id} srcDoc={srcdoc}></iframe>
      <Link className="iframe-widget__link" to={`/web/${_id}`} target="_blank">
        Visit website
      </Link>
      <br />
      <NavLink className="iframe-widget__link" to={`/builder/${_id}`}>
        Edit
      </NavLink>
    </div>
  );
}

export default WebsiteWidget;
