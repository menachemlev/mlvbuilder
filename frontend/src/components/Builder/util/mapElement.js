import { toPercentages } from "./generalFunctions";

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

const handleOnTouchStart = (e) => {
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
        cursor: "grab",
        left: elm.left,
        zIndex: 1,
        width: elm.width,
        height: elm.height,
      }}
      src={
        elm.src ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png"
      }
      alt={""}
      onClick={() => {
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "image")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
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
        cursor: "grab",
        zIndex: 1,
        width: elm.width,
        height: elm.height,
        textAlign: "center",
        fontFamily: "Poppins",
        color: elm.color,
      }}
      alt={""}
      href={elm.url || "#"}
      onClick={(e) => {
        e.preventDefault();
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "Link")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
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
        cursor: "grab",
        left: elm.left,
        zIndex: 1,
        minWidth: elm.width,
        height: elm.height,
        textAlign: "center",
      }}
      alt={""}
      href={elm.url || "#"}
      onClick={(e) => {
        e.preventDefault();
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "button")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
    >
      <button
        draggable={true}
        style={{
          padding: "0.6em 1em",
          color: elm.color,
          background: elm.background,
          cursor: "pointer",
          transition: "0.33s",
          fontWeight: "bolder",
          borderRadius: "0.5em",
          fontSize: elm.fontSize || "1em",
        }}
      >
        {elm.title || "Some button"}
      </button>
    </a>
  );
};
const generateParagraphElement = (elm, props) => {
  const addEnters = (text = "A paragraph") => {
    const charsArray = text.split("");
    let charsCounter = 0;
    for (let i = 0; i < charsArray.length; i++) {
      charsCounter++;
      if (text.charCodeAt(i) === 13) charsCounter = 0;
      if (text.charCodeAt(i) === 32) {
        if (charsCounter < 30) continue;
        charsArray[i] = "\n";
        charsCounter = 0;
      }
    }
    return charsArray.join("");
  };
  return (
    <pre
      className={`preview__element ${
        props.currentElementEdited?.id === elm.id
          ? "preview__element-active"
          : ""
      }`}
      key={elm.id}
      style={{
        position: "absolute",
        top: elm.top,
        cursor: "grab",
        left: elm.left,
        zIndex: 1,
        color: elm.color,
        textAlign: "center",
      }}
      alt={""}
      onClick={() => {
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "paragraph")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
    >
      {addEnters(elm.title)}
    </pre>
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
        cursor: "grab",
        left: elm.left,
        zIndex: 1,
        fontSize: "2em",
        color: elm.color,
        textAlign: "center",
      }}
      src={elm.src}
      alt={""}
      onClick={() => {
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "title")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
    >
      {elm.title || "a title"}
    </h1>
  );
};

const generatBackgroundElement = (elm, props) => {
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
        cursor: "grab",
        left: elm.left,
        width: elm.width,
        height: elm.height,
        zIndex: 0,
        background: elm.background,
      }}
      onClick={() => {
        props.onElementClick(elm.id);
      }}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragEnd={(e) => {
        handleDragEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
      onTouchStart={(e) => {
        handleOnTouchStart(e);
      }}
      onTouchMove={(e) => handleOnTouchMove(e, "background")}
      onTouchEnd={(e) => {
        handleOnTouchEnd(
          e,
          elm,
          props.refFoward,
          props.height,
          props.updatePreviewElement
        );
      }}
    ></div>
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
    elementToReturn = generatBackgroundElement(elm, props);
  }
  return elementToReturn;
};

export default mapElements;
