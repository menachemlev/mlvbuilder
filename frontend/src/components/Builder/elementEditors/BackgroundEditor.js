import { useEffect, useRef, useState } from "react";

function BackgroundEditor(props) {
  const height = useRef(null);
  const width = useRef(null);
  const top = useRef(null);
  const left = useRef(null);
  const background = useRef(null);

  const [defaultValues, setDefaultValues] = useState({});
  const [backgroundColorWasChanged, setBackgroundColorWasChanged] =
    useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onFormSubmit({
      height: `${height.current.value}%`,
      width: `${width.current.value}%`,
      top: `${top.current.value}%`,
      left: `${left.current.value}%`,
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
          ? value?.endsWith("%")
            ? Number.parseInt(value)
            : value
          : null;
    });
    setDefaultValues(newDefaultValues);
  }, [props.currentElementEdited]);

  return (
    <form onSubmit={handleFormSubmit}>
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
        <label>Background:</label>
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

export default BackgroundEditor;
