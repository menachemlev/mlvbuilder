import { useRef, useState, useEffect } from "react";

function ParagraphEditor(props) {
  const height = useRef(null);
  const width = useRef(null);
  const fontSize = useRef(null);
  const title = useRef(null);
  const top = useRef(null);
  const left = useRef(null);
  const color = useRef(null);

  const [defaultValues, setDefaultValues] = useState({});
  const [colorWasChanged, setColorWasChanged] = useState(false);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();

    props.onFormSubmit({
      title: title.current.value,
      top: `${top.current.value}%`,
      left: `${left.current.value}%`,
      height: `${height.current.value}%`,
      width: `${width.current.value}%`,
      fontSize: `${fontSize.current.value}`,
      color: `${colorWasChanged ? color.current.value : defaultValues.color}`,
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <textarea
          ref={title}
          defaultValue={defaultValues.title}
          type="text"
          placeholder="Text..."
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
        <input
          ref={color}
          onChange={() => {
            setColorWasChanged(true);
          }}
          type="color"
        />{" "}
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
          defaultValue={+defaultValues.fontSize}
        />
      </div>
      <div>
        <label>Font size:</label>

        <input
          ref={fontSize}
          defaultValue={+Number.parseFloat(defaultValues.fontSize)}
          type="number"
          min="0.6"
          max="2"
          step="0.1"
        />
      </div>
      <div>
        <button>Save</button>
      </div>
    </form>
  );
}

export default ParagraphEditor;
