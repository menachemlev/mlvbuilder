import { useRef, useState, useEffect } from "react";

function LinkEditor(props) {
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
      title: title.current.value,
      top: `${top.current.value}%`,
      left: `${left.current.value}%`,
      color: `${colorWasChanged ? color.current.value : defaultValues.color}`,
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
        />
      </div>
      <div>
        <input
          ref={color}
          onChange={() => {
            setColorWasChanged(true);
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

export default LinkEditor;
