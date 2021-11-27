import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ReactDOM from "react-dom";

import { isItMobile } from "./util/generalFunctions";

export default function EditElem(props) {
  useEffect(() => {
    return () => {
      props.setDragOnTouch(false);
      props.setShowEditor(false);
    };
  }, []);
  return (
    <>
      {ReactDOM.createPortal(
        <>
          <EditIcon
            style={{
              cursor: "pointer",
              color: "cyan",
              zIndex: 200,
              transform: "translateY(-150%)",
              position: "absolute",
              left: `${Math.floor(props.position.left)}px`,
              top: `${+Math.floor(props.position.top)}px`,
            }}
            onClick={() => {
              props.setShowEditor(true);
            }}
          />

          {isItMobile() && (
            <DragIndicatorIcon
              style={{
                cursor: "pointer",
                color: props.dragOnTouch ? "#6a89cf" : "cyan",
                zIndex: 200,
                transform: "translateY(-150%) translateX(-50%)",
                position: "absolute",
                left: `${Math.floor(
                  (props.position.right + props.position.left) / 2
                )}px`,
                top: `${+Math.floor(props.position.top)}px`,
              }}
              onClick={() => {
                props.setDragOnTouch(true);
              }}
            />
          )}

          <RemoveCircleIcon
            style={{
              cursor: "pointer",
              color: "cyan",
              zIndex: 200,
              transform: "translateY(-150%) translateX(-100%)",
              position: "absolute",
              left: `${Math.floor(props.position.right)}px`,
              top: `${+Math.floor(props.position.top)}px`,
            }}
            onClick={() => {
              props.deleteElement(true);
            }}
          />
        </>,
        document.getElementById("modals")
      )}
    </>
  );
}
