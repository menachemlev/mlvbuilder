import { useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./WebsiteWidget.css";
import Auth from "./../../Auth/Auth";
function WebsiteWidget(props) {
  const ctx = useContext(Auth);
  const iframeRef = useRef(null);

  const { html, _id } = props.website;
  const srcdoc = html.replace(/&lt;/g, "<").split("<script>")[0];

  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument;
    const landspaceHTMLs = [...iframeDocument.querySelectorAll(".landspace")];
    const portraitHTMLs = [...iframeDocument.querySelectorAll(".portrait")];

    landspaceHTMLs.forEach((landspace, index) => {
      setInterval(() => {
        const isLandspace = landspace && landspace.innerHTML.length > 0;
        landspace.style.display =
          landspace.i !== isLandspace ? "block" : "none";
        portraitHTMLs[index].style.display = !isLandspace ? "block" : "none";
      }, 1000);
    });
  }, []);

  return (
    <div className="iframe-widget">
      <iframe ref={iframeRef} title={_id} srcDoc={srcdoc}></iframe>
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
