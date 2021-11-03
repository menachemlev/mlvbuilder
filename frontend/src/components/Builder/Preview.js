import "./Preview.css";
import mapElements from "./util/mapElement";

import { isItMobile } from "./../Builder/util/generalFunctions";
function Preview(props) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      ref={props.refFoward}
      className={`builder__preview ${
        isItMobile() ? "long" : props.isPreviewLandspace ? "long" : ""
      }`}
    >
      <div
        className="portrait"
        style={{
          position: "absolute",
          height: `${props.height}%`,
          width: "100%",
          top: "0",
          left: "0",
          display: `${props.isPreviewLandspace ? "none" : "block"}`,
          overflowX: "hidden",
        }}
      >
        {props.elements
          .filter((el) => el.forLandspace === false)
          .map((el) => mapElements(el, props))}
      </div>
      <div
        className="landspace"
        style={{
          position: "absolute",
          height: `${props.height}%`,
          width: "100%",
          top: "0",
          left: "0",
          display: `${props.isPreviewLandspace ? "block" : "none"}`,
          overflowX: "hidden",
        }}
      >
        {props.elements
          .filter((el) => el.forLandspace === true)
          .map((el) => mapElements(el, props))}
      </div>
    </div>
  );
}

export default Preview;
