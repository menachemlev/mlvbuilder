import { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { isItMobile } from "./util/generalFunctions";

export default function EditElem(props) {
  useEffect(() => {
    return () => {
      props.setDragOnTouch(false);
      props.setShowEditor(false);
    };
  }, []);

  const width = Number.parseFloat(props.currentElementEdited?.width);
  const top = Number.parseFloat(props.currentElementEdited?.top);
  const left = Number.parseFloat(props.currentElementEdited?.left);

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
            left + width < 90 ? "translate(20%,0%)" : "translate(-120%,0%)",
          position: "absolute",
          left: `${left + width < 90 ? left + width : left}%`,
          top: `${top}%`,
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
              left + width < 90
                ? "translate(20%,150%)"
                : "translate(-120%,150%)",
            position: "absolute",
            left: `${left + width < 90 ? left + width : left}%`,
            top: `${top}%`,
          }}
          onClick={() => {
            props.setDragOnTouch(true);
          }}
        />
      )}
    </>
  );
}
