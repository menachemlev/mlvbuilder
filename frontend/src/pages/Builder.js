import Elements from "../components/Builder/Elements";
import Preview from "../components/Builder/Preview";
import Menu from "../components/Builder/Menu";

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

  const [showEditor, setShowEditor] = useState(false);
  const [dragOnTouch, setDragOnTouch] = useState(false);

  const [backup, setBackup] = useState([]);
  const [wasEdited, setWasEdited] = useState(false);

  useEffect(() => {
    setWasEdited(backup.length > 0);
  }, [backup]);

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
    ctx.setShowHeader(false);
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 46) handleOnDeleteElement();
    });

    if (!ctx.loggedIn) history.push("/");
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
      if (localStorage) {
        const localStorageWebsites = JSON.parse(
          localStorage.getItem("websites")
        );
        if (localStorageWebsites)
          localStorage.setItem(
            "websites",
            JSON.stringify([...localStorageWebsites, params.id])
          );
        else localStorage.setItem("websites", JSON.stringify([params.id]));
      }

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
        .catch((err) => console.error(err));

      setID(params.id);
      setPublishedWebsiteURL(`${ctx.fetchProviderURL}/web/${params.id}`);
    } else {
      setID("");
      setPublishedWebsiteURL(``);
      setPreviewElements([]);
      setBackup([]);
    }

    return () => ctx.setShowHeader(true);
  }, [params]);

  useEffect(() => {
    setShowEditButton(!!currentElementEdited);
  }, [currentElementEdited]);

  const getHeightToWidthRatio = (landspace = false) => {
    const websiteWidth =
      window.innerWidth *
      (landspace ? (isItMobile() ? 0.65 : 0.77) : isItMobile() ? 0.65 : 0.23);
    const websiteHeight =
      (height / 100) * previewRef.current.getBoundingClientRect().height;
    return websiteHeight / websiteWidth;
  };

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
    const background = elementDragged.style.background;

    const isItImage = typeOfNewElement === "img";
    const isItBackground = typeOfNewElement === "background";
    //Preparing data
    const newElement = {
      id: String(Math.random() * 100000),
      top: isItBackground
        ? "0%"
        : toPercentages(topPropertyCss, previewRef.current, "height"),
      left: isItBackground
        ? "0%"
        : toPercentages(leftPropertyCss, previewRef.current, "width"),
      type: typeOfNewElement,
      width: isItBackground
        ? "100%"
        : isItImage
        ? "25%"
        : `${
            toPercentagesNum(widthElm, previewRef.current, "width") *
            (typeOfNewElement === "video" ? 2 : 1)
          }%`,
      height: isItBackground
        ? "100%"
        : isItImage
        ? undefined
        : `${
            toPercentagesNum(widthElm, previewRef.current, "height") *
            (typeOfNewElement === "video" ? 2 : 1) *
            (100 / height)
          }%`,
      color: "#333",
      background: isItBackground ? `lightblue` : `violet`,
      forLandspace: isPreviewLandspace,
    };
    updateBackup();
    setPreviewElements((prev) => [...prev, newElement]);
  };

  const handleOnElementClick = (id, elementBounding) => {
    const newCurrentElementEdited = previewElements.find(
      (elm) => elm?.id === id
    );
    setCurrentElementEdited(newCurrentElementEdited);
    setDragOnTouch(false);
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

  const handleOnCopyElement = () => {
    if (!currentElementEdited) return;
    const elemTop = Number.parseFloat(currentElementEdited.top);
    const elemLeft = Number.parseFloat(currentElementEdited.left);

    const copyElem = {
      ...currentElementEdited,
      top: `${elemTop + 4}%`,
      left: `${elemLeft + 4}%`,
      id: String(Math.random() * 100000),
    };
    updateBackup();
    setPreviewElements((prev) => [...prev, copyElem]);
    setCurrentElementEdited(null);
  };
  //BUILDING FUNCTIONALITY
  const handleOnStepBack = () => {
    setCurrentElementEdited(null);
    setPreviewElements(backup[0] || []);
    if (backup.length > 1) setBackup((prev) => prev.slice(1));
  };

  const handleOnPreview = () => {
    setCurrentElementEdited(null);

    const newWindow = window.open("", "_blank");
    newWindow.document.write(
      addHeaderAndEnderHTML(
        previewRef.current.innerHTML,
        getHeightToWidthRatio(true),
        getHeightToWidthRatio()
      )
    );
  };

  const handleGoPublic = () => {
    if (previewElements.length === 0) return;
    setPublishingLoading(true);
    setCurrentElementEdited(null);
    fetch(`${ctx.fetchProviderURL}${id ? `/web/${id}` : `/web/`}`, {
      method: `${id ? "PATCH" : "POST"}`,
      body: JSON.stringify({
        public: true,
        password: ctx.password,
        email: ctx.email,
        height,
        html: previewRef.current.innerHTML,
        previewElements: JSON.stringify(previewElements),
        heightToWidthRatioLandspace: getHeightToWidthRatio(true),
        heightToWidthRatioPortrait: getHeightToWidthRatio(),
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
      .catch((err) => console.error(err));
  };

  const handleOnSave = () => {
    if (previewElements.length === 0) return;
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
        heightToWidthRatioLandspace: getHeightToWidthRatio(true),
        heightToWidthRatioPortrait: getHeightToWidthRatio(),
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
      .catch((err) => console.error(err));
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
    setCurrentElementEdited(null);
  };

  return (
    <div className="builder page">
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
          wasEdited={wasEdited}
          showEditButton={showEditButton}
          dragOnTouch={dragOnTouch}
          setDragOnTouch={setDragOnTouch}
          deleteElement={handleOnDeleteElement}
          copyElement={handleOnCopyElement}
          updatePreviewElement={handleOnUpdatePreviewElement}
          height={height}
          isPreviewLandspace={isPreviewLandspace}
          currentElementEdited={currentElementEdited}
          refFoward={previewRef}
          onElementClick={handleOnElementClick}
          elements={previewElements}
          setShowEditor={setShowEditor}
        />
      </div>
    </div>
  );
}
export default Builder;
