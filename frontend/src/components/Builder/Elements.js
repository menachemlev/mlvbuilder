import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Elements.css";

import { isItMobile } from "./../Builder/util/generalFunctions";

export let draggingFunctions;
function Elements(props) {
  const [draggingPosition, setDraggingPosition] = useState({ left: 0, top: 0 });
  const [lastTouchPosition, setLastTouchPostion] = useState({
    left: 0,
    top: 0,
  });
  const [showTouchMark, setShowTouchMark] = useState({
    active: false,
    type: "",
  });

  const handleOnTouchStart = (e) => {
    const elementDraggedRect = e.target.getBoundingClientRect();
    const draggingPositionLeft = e.touches[0].clientX - elementDraggedRect.left;
    const draggingPositionTop = e.touches[0].clientY - elementDraggedRect.top;
    setDraggingPosition({
      left: draggingPositionLeft,
      top: draggingPositionTop,
    });
  };

  const handleOnTouchMove = (e, type) => {
    setLastTouchPostion({
      left: e.touches[0].clientX,
      top: e.touches[0].clientY,
    });
    setShowTouchMark({ active: true, type });
  };

  const handleOnTouchEnd = (e) => {
    const mouseCoords = { x: lastTouchPosition.left, y: lastTouchPosition.top };
    props.onElementDragEnd(
      mouseCoords,
      e.target.closest(".builder__elements-element"),
      draggingPosition
    );
    setShowTouchMark({ active: false, type: "" });
    setDraggingPosition({});
  };

  const handleDragStart = (e) => {
    const elementDraggedRect = e.target.getBoundingClientRect();
    const draggingPositionLeft = e.clientX - elementDraggedRect.left;
    const draggingPositionTop = e.clientY - elementDraggedRect.top;
    setDraggingPosition({
      left: draggingPositionLeft,
      top: draggingPositionTop,
    });
  };

  const handleDragEnd = (e) => {
    const mouseCoords = { x: e.clientX, y: e.clientY };
    props.onElementDragEnd(
      mouseCoords,
      e.target.closest(".builder__elements-element"),
      draggingPosition
    );

    setDraggingPosition({});
  };

  const touchMarkComponent = ReactDOM.createPortal(
    <div
      style={{
        background: "black",
        padding: "2em",
        borderRadius: "50%",
        position: "absolute",
        left: lastTouchPosition.left - draggingPosition.left,
        top: lastTouchPosition.top - draggingPosition.top,
        zIndex: 100,
        color: "white",
      }}
    >
      {showTouchMark.type}
    </div>,
    document.getElementById("modals")
  );

  return (
    <div
      ref={props.refFoward}
      style={{}}
      className={`builder__elements ${
        isItMobile() ? "" : props.isPreviewLandspace ? "" : "long"
      }`}
    >
      {showTouchMark.active && touchMarkComponent}
      <div style={{ flexBasis: "100%", height: "2em" }}></div>
      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "image")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-img"
      >
        🖼Image{" "}
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "video")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-video"
      >
        🎥 Video
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "link")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-link"
      >
        🔗Link
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "button")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-button"
        style={{
          color: "white",
          background: "linear-gradient(rgb(96, 167, 190), rgb(67, 115, 219))",
        }}
      >
        🧈Button
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "paragraph")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-paragraph"
      >
        📃Paragraph
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "Title")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-title"
      >
        👍Title
      </div>

      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleOnTouchStart}
        onTouchMove={(e) => handleOnTouchMove(e, "Background")}
        onTouchEnd={handleOnTouchEnd}
        className="builder__elements-element builder__elements-element-background"
        style={{
          background: "linear-gradient(rgb(96, 167, 190), rgb(67, 115, 219))",
        }}
      >
        💻Background
      </div>
    </div>
  );
}

export default Elements;
