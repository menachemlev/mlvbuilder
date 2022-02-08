import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import helpVid from "./help.mp4";
import CloseIcon from "@mui/icons-material/Close";
import VideoPlayer from "./../../UI/VideoPlayer/VideoPlayer";

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
      <CloseIcon
        style={{
          position: "fixed",
          top: "2%",
          right: "2%",
          cursor: "pointer",
          zIndex: "200",
        }}
        onClick={() => {
          props.setShowHelp(false);
        }}
      />

      <VideoPlayer src={helpVid} type="video/mp4" />
    </div>,
    document.getElementById("modals")
  );
}
export default Help;
