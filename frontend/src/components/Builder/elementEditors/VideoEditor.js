import { useRef, useState, useEffect } from "react";

function VideoEditor(props) {
  const height = useRef(null);
  const width = useRef(null);
  const fontSize = useRef(null);
  const title = useRef(null);
  const url = useRef(null);
  const top = useRef(null);
  const left = useRef(null);
  const color = useRef(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [colorWasChanged, setColorWasChanged] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onFormSubmit({
      url: url.current.value,
      top: `${top.current.value}%`,
      left: `${left.current.value}%`,
      height: `${height.current.value}%`,
      width: `${width.current.value}%`,
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
        <button>Save</button>
      </div>
    </form>
  );
}

export default VideoEditor;
