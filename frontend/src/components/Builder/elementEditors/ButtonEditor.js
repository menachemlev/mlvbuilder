import { useEffect, useRef, useState } from "react";

function ButtonEditor(props) {
  const height = useRef(null);
  const width = useRef(null);
  const fontSize = useRef(null);
  const url = useRef(null);
  const title = useRef(null);
  const top = useRef(null);
  const left = useRef(null);
  const color = useRef(null);
  const background = useRef(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [colorWasChanged, setColorWasChanged] = useState(false);
  const [backgroundColorWasChanged, setBackgroundColorWasChanged] =
    useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onFormSubmit({
      url: url.current.value,
      title: title.current.value,
      height: `${height.current.value}%`,
      width: `${width.current.value}%`,
      fontSize: `${fontSize.current.value}`,
      top: `${top.current.value}%`,
      left: `${left.current.value}%`,
      color: `${colorWasChanged ? color.current.value : defaultValues.color}`,
      background: `${
        backgroundColorWasChanged
          ? background.current.value
          : defaultValues.background
      }`,
    });
  };
  useEffect(() => {
    const newDefaultValues = {};
    Object.entries(props.currentElementEdited).forEach(([key, value], _) => {
      newDefaultValues[key] =
        typeof value === "string"
          ? value?.endsWith("%") || value?.endsWith("em")
            ? +Number.parseFloat(value).toFixed(1)
            : value
          : null;
    });
    setDefaultValues(newDefaultValues);
  }, [props.currentElementEdited]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label>Title:</label>
        <input
          ref={title}
          type="text"
          defaultValue={defaultValues.title}
          placeholder="title"
        />
      </div>
      <div>
        <label>URL:</label>
        <input
          ref={url}
          type="text"
          defaultValue={defaultValues.url}
          placeholder="url"
        />
      </div>
      <div>
        <label>Top:</label>
        <input
          ref={top}
          defaultValue={defaultValues.top}
          type="number"
          min="0"
          max="100"
          step="0.1"
        />
      </div>
      <div>
        <label>Left:</label>

        <input
          ref={left}
          defaultValue={defaultValues.left}
          type="number"
          min="0"
          max="100"
          step="0.1"
        />
      </div>
      <div>
        <label>Width:</label>
        <input
          ref={width}
          type="number"
          min="0"
          max="100"
          step="0.1"
          defaultValue={defaultValues.width}
        />
      </div>
      <div>
        <label>Height:</label>

        <input
          ref={height}
          type="number"
          min="0"
          max="100"
          step="0.1"
          defaultValue={defaultValues.height}
        />
      </div>
      <div>
        <label>Font size:</label>

        <input
          ref={fontSize}
          defaultValue={+defaultValues.fontSize}
          type="number"
          min="0.6"
          max="2"
          step="0.1"
        />
      </div>
      <div>
        <label>Color: </label>
        <input
          ref={color}
          onChange={() => {
            setColorWasChanged(true);
          }}
          type="color"
        />{" "}
      </div>
      <div>
        <label>Background: </label>
        <input
          ref={background}
          onChange={() => {
            setBackgroundColorWasChanged(true);
          }}
          type="color"
        />{" "}
      </div>
      <div>
        <button>Save</button>
      </div>
    </form>
  );
}

export default ButtonEditor;
