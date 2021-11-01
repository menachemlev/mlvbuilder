import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
function Help(props) {
  const [fadeInAnimation, setFadeInAnimation] = useState("");
  useEffect(() => {
    setFadeInAnimation("fadeIn");
  }, []);

  return ReactDOM.createPortal(
    <div
      className={`${fadeInAnimation}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "80%",
        height: "80vh",
        boxShadow: "0 0 2em rgba(0,0,0,0.3)",
        background: "white",
        border: "3px solid #333",
        overflowY: "scroll",
        overflowX: "none",
        zIndex: "1000",
        padding: "2em",
      }}
    >
      <span
        style={{ position: "fixed", top: "2%", right: "2%", cursor: "pointer" }}
        onClick={() => {
          props.setShowHelp(false);
        }}
      >
        ❌
      </span>
      <h1>Hello help</h1>
    </div>,
    document.getElementById("modals")
  );
}
export default Help;
