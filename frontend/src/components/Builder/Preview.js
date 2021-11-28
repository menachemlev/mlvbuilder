import "./Preview.css";
import mapElements from "./util/mapElement";
import EditButton from "./EditButton";

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
      {props.elements.length === 0 && !props.wasEdited && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "1.7em",
            textAlign: "center",
            color: "rgba(0,0,0,0.5)",
          }}
        >
          Here go your elements...
          <br />
          <small style={{ fontSize: "0.5em", fontStyle: "oblique" }}>
            (👆 Drag here some elements to get started)
          </small>
        </div>
      )}

      <div
        className="portrait"
        style={{
          position: "absolute",
          height: `${props.height}%`,
          width: "100%",
          top: "0",
          left: "0",
          display: `${props.isPreviewLandspace ? "none" : "block"}`,
          overflow: "hidden",
        }}
      >
        {props.showEditButton && (
          <EditButton
            currentElementEdited={props.currentElementEdited}
            setShowEditor={props.setShowEditor}
            deleteElement={props.deleteElement}
            setDragOnTouch={props.setDragOnTouch}
            dragOnTouch={props.dragOnTouch}
            copyElement={props.copyElement}
          />
        )}

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
          overflow: "hidden",
        }}
      >
        {props.showEditButton && (
          <EditButton
            currentElementEdited={props.currentElementEdited}
            setShowEditor={props.setShowEditor}
            deleteElement={props.deleteElement}
            setDragOnTouch={props.setDragOnTouch}
            dragOnTouch={props.dragOnTouch}
            copyElement={props.copyElement}
          />
        )}

        {props.elements
          .filter((el) => el.forLandspace === true)
          .map((el) => mapElements(el, props))}
      </div>
    </div>
  );
}

export default Preview;
