import { toPercentages } from "./generalFunctions";

import React, { useState } from "react";

const draggingPosition = { left: 0, top: 0 };
const lastTouchPosition = { left: 0, top: 0 };

const processDragOrTouchEnd = (
  mouseCoords,
  elementObj,
  previewElement,
  height,
  updatePreviewElement
) => {
  const leftBorder = previewElement.current.getBoundingClientRect().left;
  const topBorder = previewElement.current.getBoundingClientRect().top;

  //CHECKING IF ELEMENT WAS DRAGGED TO PREVIEW
  if (mouseCoords.x < leftBorder || mouseCoords.y < topBorder) return;
  const scrollTopPreview = previewElement.current.scrollTop;

  const leftPropertyCss = Math.max(
    0,
    mouseCoords.x - leftBorder - draggingPosition.left
  );

  const topPropertyCss = Math.max(
    0,
    (mouseCoords.y - topBorder - draggingPosition.top + scrollTopPreview) *
      (100 / height) //Normalizing height
  );

  const left = toPercentages(leftPropertyCss, previewElement.current, "width");
  const top = toPercentages(topPropertyCss, previewElement.current, "height");
  updatePreviewElement(elementObj.id, left, top);
};

const handleOnTouchStart = (e, props) => {
  const elementDraggedRect = e.target.getBoundingClientRect();
  draggingPosition.left = e.touches[0].clientX - elementDraggedRect.left;
  draggingPosition.top = e.touches[0].clientY - elementDraggedRect.top;
};

const handleOnTouchMove = (e, type) => {
  lastTouchPosition.left = e.touches[0].clientX;
  lastTouchPosition.top = e.touches[0].clientY;
};

const handleDragStart = (e) => {
  const elementDraggedRect = e.target.getBoundingClientRect();
  draggingPosition.left = e.clientX - elementDraggedRect.left;
  draggingPosition.top = e.clientY - elementDraggedRect.top;
};

const handleDragEnd = (
  e,
  elementObj,
  previewElement,
  height,
  updatePreviewElement
) => {
  const mouseCoords = { x: e.clientX, y: e.clientY };
  processDragOrTouchEnd(
    mouseCoords,
    elementObj,
    previewElement,
    height,
    updatePreviewElement
  );
};

const handleOnTouchEnd = (
  e,
  elementObj,
  previewElement,
  height,
  updatePreviewElement
) => {
  const mouseCoords = { x: lastTouchPosition.left, y: lastTouchPosition.top };
  processDragOrTouchEnd(
    mouseCoords,
    elementObj,
    previewElement,
    height,
    updatePreviewElement
  );
};

const generateDraggingElemProps = (elm, props) => {
  return {
    onClick: (e) => {
      e.preventDefault();
      props.onElementClick(elm.id, e.target.getBoundingClientRect());
    },
    onDragStart: (e) => {
      handleDragStart(e);
    },
    onDragEnd: (e) => {
      handleDragEnd(
        e,
        elm,
        props.refFoward,
        props.height,
        props.updatePreviewElement
      );
    },
    onTouchStart: (e) => {
      if (props.dragOnTouch) handleOnTouchStart(e, props);
    },
    onTouchMove: (e) => {
      if (props.dragOnTouch) handleOnTouchMove(e, elm.type);
    },
    onTouchEnd: (e) => {
      if (props.dragOnTouch) {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }
    },
    draggable: true,
  };
};

const generateImgElement = (elm, props) => {
  return (
    <img
      className={` preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,
        width: elm.width,
        height: elm.height,
        left: elm.left,
        zIndex: 1,
      }}
      src={
        elm.src ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png"
      }
      alt={""}
      {...generateDraggingElemProps(elm, props)}
    />
  );
};
const generateLinkElement = (elm, props) => {
  return (
    <a
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,
        left: elm.left,

        zIndex: 1,
        textAlign: "center",
        fontFamily: "Poppins",
        width: elm.width,
        height: elm.height,
        color: elm.color,
        display: "inline-block",
        fontSize: `${elm?.fontSize}em` || "0.6em",
        overflowWrap: "break-word",
        wordWrap: "break-word",
      }}
      alt={""}
      href={elm.url || "#"}
      {...generateDraggingElemProps(elm, props)}
    >
      {elm.title || "Some link"}
    </a>
  );
};
const generateButtonElement = (elm, props) => {
  return (
    <a
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,

        left: elm.left,
        zIndex: 1,
        textAlign: "center",
        width: elm.width,
        height: elm.height,
        display: "inline-block",
        overflowWrap: "break-word",
        wordWrap: "break-word",
      }}
      alt={""}
      href={elm.url || "#"}
      {...generateDraggingElemProps(elm, props)}
    >
      <button
        draggable={true}
        style={{
          padding: "0.6em",
          color: elm.color,
          background: elm.background,
          cursor: "pointer",
          transition: "0.33s",
          fontWeight: "bolder",
          borderRadius: "0.5em",
          fontSize: `${elm?.fontSize}em` || "0.6em",
          fontFamily: "Poppins",
          width: "100%",
          height: "100%",
          overflowWrap: "break-word",
          wordWrap: "break-word",
        }}
      >
        {elm.title || "Some button"}
      </button>
    </a>
  );
};
const generateParagraphElement = (elm, props) => {
  return (
    <p
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,

        left: elm.left,
        zIndex: 1,
        color: elm.color,
        textAlign: "center",
        fontSize: `${elm?.fontSize}em` || "0.6em",
        width: elm.width,
        fontFamily: "Poppins",
        height: elm.height,
        display: "inline-block",
        overflowWrap: "break-word",
        wordWrap: "break-word",
      }}
      alt={""}
      {...generateDraggingElemProps(elm, props)}
    >
      {elm.title || `A very long paragraph`}
    </p>
  );
};
const generatTitleElement = (elm, props) => {
  return (
    <h1
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,

        left: elm.left,
        zIndex: 1,
        fontSize: `${elm?.fontSize}em` || "2em",
        width: elm.width,
        height: elm.height,
        color: elm.color,
        display: "inline-block",
        textAlign: "center",
        fontFamily: "Poppins",
        overflowWrap: "break-word",
        wordWrap: "break-word",
      }}
      src={elm.src}
      alt={""}
      {...generateDraggingElemProps(elm, props)}
    >
      {elm.title || "a title"}
    </h1>
  );
};

const generateBackgroundElement = (elm, props) => {
  return (
    <div
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,

        left: elm.left,
        width: elm.width,
        height: elm.height,
        zIndex: 0,
        background: elm.background,
      }}
      {...generateDraggingElemProps(elm, props)}
    ></div>
  );
};

const generateVideoElement = (elm, props) => {
  return (
    <div
      className="iframe-holder-preview"
      style={{
        position: "absolute",
        top: elm.top,
        left: elm.left,
        width: elm.width,
        height: elm.height,
        zIndex: 1,
      }}
      {...generateDraggingElemProps(elm, props)}
    >
      <iframe
        title={`${Math.random() * 100000}`}
        className={`preview__element ${
          props.currentElementEdited?.id === elm.id
            ? "preview__element-active"
            : ""
        }`}
        key={elm.id}
        style={{
          width: "100%",
          height: "100%",
        }}
        src={
          elm.url?.replace("watch?v=", "embed/") ||
          "https://www.youtube.com/embed/RDV3Z1KCBvo"
        }
      ></iframe>
    </div>
  );
};

const mapElements = (elm, props) => {
  if (!elm?.type) return;
  let elementToReturn;
  if (elm.type === "img") {
    elementToReturn = generateImgElement(elm, props);
  }
  if (elm.type === "link") {
    elementToReturn = generateLinkElement(elm, props);
  }
  if (elm.type === "button") {
    elementToReturn = generateButtonElement(elm, props);
  }
  if (elm.type === "paragraph") {
    elementToReturn = generateParagraphElement(elm, props);
  }
  if (elm.type === "title") {
    elementToReturn = generatTitleElement(elm, props);
  }
  if (elm.type === "background") {
    elementToReturn = generateBackgroundElement(elm, props);
  }
  if (elm.type === "video") {
    elementToReturn = generateVideoElement(elm, props);
  }
  return elementToReturn;
};

export default mapElements;
