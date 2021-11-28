import ReactDOM from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import ImgEditor from "./elementEditors/ImgEditor";
import LinkEditor from "./elementEditors/LinkEditor";
import ButtonEditor from "./elementEditors/ButtonEditor";
import TitleEditor from "./elementEditors/TitleEditor";
import ParagraphEditor from "./elementEditors/ParagraphEditor";
import BackgroundEditor from "./elementEditors/BackgroundEditor";
import VideoEditor from "./elementEditors/VideoEditor";
import Card from "./../UI/Card";

function EditorPop(props) {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        boxShadow: "0 0 2em rgba(0,0,0,0.3)",
        background: "white",
        border: "3px solid #333",
        overflowY: "scroll",
        overflowX: "none",
        zIndex: "1000",
      }}
    >
      <Card>
        {props.data.currentElementEdited?.type === "img" && (
          <ImgEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "link" && (
          <LinkEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "button" && (
          <ButtonEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "title" && (
          <TitleEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "paragraph" && (
          <ParagraphEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "background" && (
          <BackgroundEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
        {props.data.currentElementEdited?.type === "video" && (
          <VideoEditor
            currentElementEdited={props.data.currentElementEdited}
            onFormSubmit={props.handleFormSubmit}
          />
        )}
      </Card>
      <CloseIcon
        style={{
          position: "absolute",
          right: "1%",
          bottom: "1%",
          fontSize: "2em",
          cursor: "pointer",
        }}
        onClick={props.onCloseEditor}
      />
    </div>,
    document.getElementById("modals")
  );
}
export default EditorPop;
