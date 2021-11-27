import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ReactDOM from "react-dom";

export default function EditElem(props) {
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
