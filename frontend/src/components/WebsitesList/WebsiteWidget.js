import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./WebsiteWidget.css";
import Auth from "./../../Auth/Auth";
function WebsiteWidget(props) {
  const ctx = useContext(Auth);
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
      <a
        className="iframe-widget__link"
        rel="noreferrer"
        href={`${ctx.fetchProviderURL}/web/${_id}`}
        target="_blank"
      >
        Visit website
      </a>
      <br />
      {ctx.name !== "guest" && (
        <NavLink className="iframe-widget__link" to={`/builder/${_id}`}>
          Edit
        </NavLink>
      )}
    </div>
  );
}

export default WebsiteWidget;
