import Elements from "../components/Builder/Elements";
import Preview from "../components/Builder/Preview";
import Menu from "../components/Builder/Menu";
import EditButton from "../components/Builder/EditButton";

import "./Builder.css";

import { useState, useRef, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import Auth from "./../Auth/Auth";

import {
  isItMobile,
  generateHeaders,
  toPercentages,
  toPercentagesNum,
  addHeaderAndEnderHTML,
} from "../components/Builder/util/generalFunctions";

function Builder(props) {
  const ctx = useContext(Auth);
  const params = useParams();
  const history = useHistory();

  const [id, setID] = useState("");
  const [previewElements, setPreviewElements] = useState([]);
  const [currentElementEdited, setCurrentElementEdited] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [editButtonPosition, setEditButtonPosition] = useState({
    top: 0,
    left: 0,
    right: 0,
  });

  const [showEditor, setShowEditor] = useState(false);

  const [backup, setBackup] = useState([]);

  const [publishedWebsiteURL, setPublishedWebsiteURL] = useState("");

  const [publishingLoading, setPublishingLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [isPreviewLandspace, setIsPreviewLandspace] = useState(true);
  const [height, setHeight] = useState(100);

  const previewRef = useRef(null);
  const elementsRef = useRef(null);
  const heightInputRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 46) handleOnDeleteElement();
    });

    if (!ctx.loggedIn) history.push("/login");
    setDeletingLoading(false);
    setPublishingLoading(false);
    setSavingLoading(false);
    setCurrentElementEdited(null);

    if (isItMobile()) {
      setInterval(() => {
        setIsPreviewLandspace(window.innerWidth > window.innerHeight);
      }, 1000);
      window.addEventListener("orientationchange", () => {
        setIsPreviewLandspace(window.innerWidth > window.innerHeight);
      });
    }

    if (params.id) {
      fetch(`${ctx.fetchProviderURL}/web/elements/${params.id}`)
        .then((res) => {
          if (!res) throw new Error("Something went wrong");
          return res.json();
        })
        .then((response) => {
          if (response.status === "fail") throw new Error(response.message);
          setHeight(+response?.data.previewElements.height);
          const previewElements = JSON.parse(
            response?.data.previewElements.previewElements
          );
          setPreviewElements(previewElements);
          setBackup([previewElements]);
        })
        .catch((err) => console.log(err));

      setID(params.id);
      setPublishedWebsiteURL(`${ctx.fetchProviderURL}/web/${params.id}`);
    } else {
      setID("");
      setPublishedWebsiteURL(``);
      setPreviewElements([]);
      setBackup([]);
    }
  }, [params]);

  useEffect(() => {
    setShowEditButton(!!currentElementEdited);
  }, [currentElementEdited]);

  const updateBackup = () => {
    const previewElementsClone = previewElements.map((elm) => {
      return { ...elm };
    });
    setBackup((prev) => [previewElementsClone, ...prev]);
  };

  //ELEMENTS FUNCTIONALLITY
  const handleElementDragEnd = (
    lastMouseCoords,
    elementDragged,
    draggingPosition
  ) => {
    //GETTING PREVIEW BOUNDARIES
    const leftBorder = previewRef.current.getBoundingClientRect().left;
    const topBorder = previewRef.current.getBoundingClientRect().top;
    //CHECKING IF ELEMENT WAS DRAGGED TO PREVIEW
    if (lastMouseCoords.x < leftBorder || lastMouseCoords.y < topBorder) return;

    //NEW ELEMENT PROPERTIES
    const scrollTopPreview = previewRef.current.scrollTop;
    const leftPropertyCss = Math.max(
      0,
      lastMouseCoords.x - leftBorder - draggingPosition.left
    );

    const topPropertyCss = Math.max(
      0,
      (lastMouseCoords.y -
        topBorder -
        draggingPosition.top +
        scrollTopPreview) *
        (100 / height) //Normalizing height
    );

    const typeOfNewElement =
      elementDragged.className.split("-")[
        elementDragged.className.split("-").length - 1
      ];

    const widthElm = elementDragged.getBoundingClientRect().width;
    const heightElm = elementDragged.getBoundingClientRect().height;

    const background = elementDragged.style.background;

    const isItImage = typeOfNewElement === "img";

    //Preparing data
    const newElement = {
      id: String(Math.random() * 100),
      top: toPercentages(topPropertyCss, previewRef.current, "height"),
      left: toPercentages(leftPropertyCss, previewRef.current, "width"),
      type: typeOfNewElement,
      width: isItImage
        ? "25%"
        : `${
            toPercentagesNum(widthElm, previewRef.current, "width") *
            (typeOfNewElement === "video" ? 2 : 1)
          }%`,
      height: isItImage
        ? undefined
        : `${
            toPercentagesNum(widthElm, previewRef.current, "height") *
            (typeOfNewElement === "video" ? 2 : 1)
          }%`,
      background,
      forLandspace: isPreviewLandspace,
    };
    updateBackup();
    setPreviewElements((prev) => [...prev, newElement]);
  };

  const handleOnElementClick = (id, elementBounding) => {
    setEditButtonPosition({
      top: elementBounding.top,
      left: elementBounding.left,
      right: elementBounding.right,
    });
    const newCurrentElementEdited = previewElements.find(
      (elm) => elm?.id === id
    );
    setCurrentElementEdited(newCurrentElementEdited);
  };

  const handleOnElementEdited = (values) => {
    const newValues = {};
    Object.entries(values).forEach(([key, value], _) => {
      if (value) {
        newValues[key] = value;
      }
    });
    const updatedElement = { ...currentElementEdited, ...newValues };
    //Backup
    //Updating elements array
    setCurrentElementEdited(updatedElement);
    const newPreviewElements = previewElements.map((elm) => {
      if (elm.id === updatedElement.id) {
        return { ...updatedElement };
      }
      return elm;
    });
    updateBackup();
    setPreviewElements([...newPreviewElements]);
    setCurrentElementEdited(null);
  };

  const handleOnUpdatePreviewElement = (id, left, top) => {
    const newPreviewElements = previewElements.map((elm) => {
      if (elm.id === id) {
        return { ...elm, left, top };
      }
      return elm;
    });
    updateBackup();
    setPreviewElements([...newPreviewElements]);
    setCurrentElementEdited(null);
  };

  const handleOnDeleteElement = () => {
    if (!currentElementEdited) return;

    const newPreviewElements = previewElements.filter(
      (elm) => elm.id !== currentElementEdited.id
    );
    updateBackup();
    setPreviewElements([...newPreviewElements]);
    setCurrentElementEdited(null);
  };
  //BUILDING FUNCTIONALITY
  const handleOnStepBack = () => {
    setPreviewElements(backup[0] || []);
    if (backup.length > 1) setBackup((prev) => prev.slice(1));
  };

  const handleOnPreview = () => {
    setCurrentElementEdited(null);
    const newWindow = window.open("", "_blank");
    newWindow.document.write(
      addHeaderAndEnderHTML(previewRef.current.innerHTML)
    );
  };

  const handleGoPublic = () => {
    setPublishingLoading(true);
    setCurrentElementEdited(null);
    console.log(`${id ? `/web/${id}` : `/web/`}`);
    fetch(`${ctx.fetchProviderURL}${id ? `/web/${id}` : `/web/`}`, {
      method: `${id ? "PATCH" : "POST"}`,
      body: JSON.stringify({
        public: true,
        password: ctx.password,
        email: ctx.email,
        height,
        html: previewRef.current.innerHTML,
        previewElements: JSON.stringify(previewElements),
      }),
      headers: generateHeaders(ctx),
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        history.push(`/builder/${response.id}`);
      })
      .catch((err) => console.log(err));
  };

  const handleOnSave = () => {
    setSavingLoading(true);
    setCurrentElementEdited(null);
    fetch(`${ctx.fetchProviderURL}${id ? `/web/${id}` : `/web/`}`, {
      method: `${id ? "PATCH" : "POST"}`,
      body: JSON.stringify({
        public: false,
        password: ctx.password,
        email: ctx.email,
        height,
        html: previewRef.current.innerHTML,
        previewElements: JSON.stringify(previewElements),
      }),
      headers: generateHeaders(ctx),
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        history.push(`/builder/${response.id}`);
      })
      .catch((err) => console.log(err));
  };

  const handleOnDelete = () => {
    setDeletingLoading(true);
    setCurrentElementEdited(null);
    fetch(`${ctx.fetchProviderURL}/web/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ password: ctx.password, email: ctx.email }),
      headers: generateHeaders(ctx),
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((response) => {
        if (response.status === "fail") throw new Error(response.message);
        history.push(`/builder`);
      })
      .catch((err) => err.message);
  };

  const handleOnSetIsPreviewLandspace = (isPreviewLandspace) => {
    setIsPreviewLandspace(isPreviewLandspace);
  };

  const handleOnSetHeight = () => {
    const newHeight = +heightInputRef.current.value;
    const ratio = height / newHeight;

    const updatedPreviewElements = previewElements.map((elm) => {
      const newTop = `${+Number.parseFloat(elm.top) * ratio}%`;
      const newHeight = `${+Number.parseFloat(elm.height) * ratio}%`;
      return { ...elm, top: newTop, height: newHeight };
    });
    setPreviewElements(updatedPreviewElements);
    setHeight(newHeight);
  };

  return (
    <div className="builder page">
      {showEditButton && (
        <EditButton
          position={editButtonPosition}
          setShowEditor={setShowEditor}
          deleteElement={handleOnDeleteElement}
        />
      )}
      <Menu
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        refHeightSetInput={heightInputRef}
        height={height}
        isPreviewLandspace={isPreviewLandspace}
        onSetIsPreviewLandspace={handleOnSetIsPreviewLandspace}
        existingWebsite={id}
        publishingLoading={publishingLoading}
        savingLoading={savingLoading}
        deletingLoading={deletingLoading}
        publishedWebsiteURL={publishedWebsiteURL}
        onDeleteElement={handleOnDeleteElement}
        onDelete={handleOnDelete}
        onElementEdited={handleOnElementEdited}
        onSetHeight={handleOnSetHeight}
        onStepBack={handleOnStepBack}
        onPreview={handleOnPreview}
        onSave={handleOnSave}
        goPublic={handleGoPublic}
        currentElementEdited={currentElementEdited}
      />
      <div className="wrapper">
        <Elements
          isPreviewLandspace={isPreviewLandspace}
          refFoward={elementsRef}
          onElementDragEnd={handleElementDragEnd}
        />
        <Preview
          updatePreviewElement={handleOnUpdatePreviewElement}
          height={height}
          isPreviewLandspace={isPreviewLandspace}
          currentElementEdited={currentElementEdited}
          refFoward={previewRef}
          onElementClick={handleOnElementClick}
          elements={previewElements}
        />
      </div>
    </div>
  );
}
export default Builder;
