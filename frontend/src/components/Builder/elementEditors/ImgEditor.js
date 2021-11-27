import { useRef, useState, useEffect, useContext } from "react";
import Auth from "./../../../Auth/Auth";
import LoadingIcon from "./../LoadingIcon";

function ImgEditor(props) {
  const src = useRef(null);
  const height = useRef(null);
  const width = useRef(null);
  const top = useRef(null);
  const left = useRef(null);
  const file = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ctx = useContext(Auth);

  const [defaultValues, setDefaultValues] = useState({});

  const handleOnFormSubmit = (e) => {
    e.preventDefault();
    const fileUpload = file.current.files[0];
    if (fileUpload) {
      setLoading(true);
      const fd = new FormData();
      fd.append("img", fileUpload);
      fd.append("user", "menachem");
      fetch(`${ctx.fetchProviderURL}/images/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => {
          if (!res) throw new Error("Something went wrong...");
          return res.json();
        })
        .then((res) => {
          if (res.status === "fail") throw new Error(res.message);
          console.log(res.location);
          setLoading(false);
          props.onFormSubmit({
            src: res.location,
            height: `${height.current.value}%`,
            width: `${width.current.value}%`,
            top: `${top.current.value}%`,
            left: `${left.current.value}%`,
          });
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      props.onFormSubmit({
        src: src.current.value,
        height: `${height.current.value}%`,
        width: `${width.current.value}%`,
        top: `${top.current.value}%`,
        left: `${left.current.value}%`,
      });
    }
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
  //
  return (
    <form
      onSubmit={handleOnFormSubmit}
      action="http://localhost:8000/images/upload"
      method="post"
      encType="multipart/form-data"
    >
      <div>
        <label>Source(url):</label>
        <input
          ref={src}
          defaultValue={defaultValues.src}
          type="text"
          placeholder="Image url"
        />
      </div>
      <div>
        <input name="img" type="file" accept="images/*" ref={file} />
      </div>
      <div>
        <label>Width:</label>
        <input
          defaultValue={defaultValues.width}
          ref={width}
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="width(%)"
        />
      </div>
      <div>
        <label>Height:</label>
        <input
          defaultValue={defaultValues.height}
          ref={height}
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="height(%)/notset=auto"
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
      {loading && <LoadingIcon />}
      <div style={{ color: "red", fontWeight: "bolder" }}>{error}</div>
      <div>
        <button>Save</button>
      </div>
    </form>
  );
}

export default ImgEditor;
