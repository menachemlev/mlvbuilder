import "./Menu.css";

import Help from "./util/Help";

//MATERIAL UI ICONS
import HelpIcon from "@mui/icons-material/Help";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";

import { useEffect, useState } from "react";

import { isItMobile } from "./../Builder/util/generalFunctions";
import EditorPop from "./EditorPop";

function Menu(props) {
  const currentElementEditedType = props.currentElementEdited?.type;
  const [showHelp, setShowHelp] = useState(false);
  const [portrait, setPortrait] = useState(
    window.innerWidth < window.innerHeight
  );
  useEffect(() => {
    setInterval(() => {
      setPortrait(window.innerWidth < window.innerHeight);
    }, 2000);
  }, []);
  const handleFormSubmit = (values) => {
    props.onElementEdited(values);
  };
  return (
    <div
      className="builder__menu"
      style={{ borderBottom: "ridge 3px lightBlue" }}
    >
      {!isItMobile() && (
        <div
          onClick={() => {
            props.onSetIsPreviewLandspace(!props.isPreviewLandspace);
          }}
          style={{
            position: "absolute",
            zIndex: "2",
            right: "1%",
            top: "102%",
            fontSize: "2.5em",
            cursor: "pointer",
            WebkitTextStroke: " 2px lightBlue",
          }}
        >
          {props.isPreviewLandspace ? (
            "📱"
          ) : (
            <div style={{ transform: "rotate(90deg)" }}>📱</div>
          )}
        </div>
      )}

      {isItMobile() && (
        <div
          style={{
            position: "absolute",
            zIndex: "2",
            right: "1%",
            top: "102%",
            fontSize: "2.5em",
            WebkitTextStroke: " 2px lightBlue",
          }}
        >
          {!props.isPreviewLandspace ? (
            "📱"
          ) : (
            <div style={{ transform: "rotate(90deg)" }}>📱</div>
          )}
        </div>
      )}

      {showHelp && (
        <Help
          isItLandspace={props.isPreviewLandspace}
          setShowHelp={setShowHelp}
        />
      )}
      {props.showEditor && (
        <EditorPop
          onCloseEditor={() => {
            props.setShowEditor(false);
          }}
          handleFormSubmit={handleFormSubmit}
          data={props}
        />
      )}
      <div className="builder__menu__step-back" onClick={props.onStepBack}>
        ◀ Step Back
      </div>
      <div className="builder__menu__save" onClick={props.onSave}>
        {props.savingLoading
          ? `⏳ ${portrait ? "" : "Loading..."}`
          : `💾  ${portrait ? "" : "Save"}`}
      </div>
      <div className="builder__menu__preview" onClick={props.onPreview}>
        <PreviewOutlinedIcon />
      </div>
      <div className="builder__menu__publish-button">
        <b onClick={props.goPublic}>
          {props.publishingLoading
            ? `⏳ ${portrait ? "" : "Loading..."}`
            : `🌐  ${portrait ? "" : "Go Public"}`}
        </b>
        {props.publishedWebsiteURL && (
          <a href={props.publishedWebsiteURL} rel="noreferrer" target="_blank">
            {`${portrait ? "🔗" : "🔗Visit"}`}
          </a>
        )}
      </div>
      <div
        className="builder__menu__delete"
        onClick={() => {
          props.existingWebsite && props.onDelete();
        }}
      >
        {props.deletingLoading ? (
          `⏳ ${portrait ? "" : "Loading..."}`
        ) : props.existingWebsite ? (
          `${portrait ? <DeleteForeverIcon /> : <DeleteForeverIcon />}`
        ) : (
          <HelpIcon onClick={() => setShowHelp(true)} />
        )}
      </div>
      <div className="builder__menu__height">
        {"Height(%)"}
        <input
          type="number"
          ref={props.refHeightSetInput}
          onChange={props.onSetHeight}
          value={props.height}
          style={{
            width: "50%",
            background: "rgba(3,3,3,0.3)",
            color: "white",
          }}
          step="10"
          min="100"
          max="1000"
        />
      </div>
    </div>
  );
}

export default Menu;

/*
    
      <div className="builder__menu__element-edit-menu">
        <b
          style={{ cursor: "pointer" }}
          onClick={() => {
            currentElementEditedType && props.setShowEditor(true);
          }}
        >
          {currentElementEditedType
            ? "✍"
            : isItMobile()
            ? "🚀"
            : "No element was chosen!"}
        </b>
      </div>
      <div
        className="builder__menu__delete-element"
        onClick={props.onDeleteElement}
      >
        {props.currentElementEdited ? (
          <RemoveCircleIcon />
        ) : (
          <p onClick={() => setShowHelp(true)}>
            <HelpIcon />
          </p>
        )}
      </div>
*/
