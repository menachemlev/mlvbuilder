import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import ReactDOM from "react-dom";

import { isItMobile } from "./util/generalFunctions";

export default function EditElem(props) {
  useEffect(() => {
    return () => {
      props.setDragOnTouch(false);
      props.setShowEditor(false);
    };
  }, []);

  const width = Number.parseFloat(props.currentElementEdited?.width);
  const height = Number.parseFloat(props.currentElementEdited?.height);
  const top = Number.parseFloat(props.currentElementEdited?.top);
  const left = Number.parseFloat(props.currentElementEdited?.left);
  const type = props.currentElementEdited?.type;

  return (
    <>
      <EditIcon
        style={{
          cursor: "pointer",
          color: "cyan",
          zIndex: 200,
          transform: `translateY(${top > 4 ? -150 : 0}%)`,
          position: "absolute",
          left: `${left}%`,
          top: `${top}%`,
        }}
        onClick={() => {
          props.setShowEditor(true);
        }}
      />

      <RemoveCircleIcon
        style={{
          cursor: "pointer",
          color: "cyan",
          zIndex: 200,
          transform: `translateY(${top > 4 ? -150 : 0}%) translateX(-100%)`,
          position: "absolute",
          left: `${left + width}%`,
          top: `${top}%`,
        }}
        onClick={() => {
          props.deleteElement(true);
        }}
      />

      <ContentCopyIcon
        style={{
          cursor: "pointer",
          color: "cyan",
          zIndex: 200,
          transform:
            type === "img" ? "translate(10%,0%)" : "translate(-100%,50%)",
          position: "absolute",
          left: `${left + width}%`,
          top: `${type === "img" ? top : top + height}%`,
        }}
        onClick={() => {
          props.copyElement();
        }}
      />
      {isItMobile() && (
        <DragIndicatorIcon
          style={{
            cursor: "pointer",
            color: props.dragOnTouch ? "#6a89cf" : "cyan",
            zIndex: 200,
            transform:
              type === "img" ? "translate(10%,150%)" : "translate(0%,50%)",
            position: "absolute",
            left: `${type === "img" ? left + width : left}%`,
            top: `${type === "img" ? top : top + height}%`,
          }}
          onClick={() => {
            props.setDragOnTouch(true);
          }}
        />
      )}
    </>
  );
}
