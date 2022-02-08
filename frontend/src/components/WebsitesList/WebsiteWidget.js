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
    iframeDocument.body.fontSize = "30%";
    const landspaceHTMLs = [...iframeDocument.querySelectorAll(".landspace")];
    const portraitHTMLs = [...iframeDocument.querySelectorAll(".portrait")];

    setInterval(() => {
      landspaceHTMLs.forEach((landspace, index) => {
        const isLandspace = landspace && landspace.innerHTML.length > 0;
        landspace.style.display = isLandspace ? "block" : "none";
        portraitHTMLs[index].style.display = !isLandspace ? "block" : "none";
      }, 1000);
    }, 1000);
  }, []);

  return (
    <div
      style={{ animation: `fadeInComponent ${1 + props.index / 3}s` }}
      className="iframe-widget"
    >
      <iframe ref={iframeRef} title={_id} srcDoc={srcdoc}></iframe>
      <div>
        <a
          className="iframe-widget__link"
          rel="noreferrer"
          href={`${ctx.fetchProviderURL}/web/${_id}`}
          target="_blank"
        >
          Visit website
        </a>

        {(ctx.name !== "guest" ||
          (localStorage &&
            localStorage.getItem("websites") &&
            JSON.parse(localStorage.getItem("websites")).includes(_id))) && (
          <NavLink className="iframe-widget__link" to={`/builder/${_id}`}>
            Edit
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default WebsiteWidget;
