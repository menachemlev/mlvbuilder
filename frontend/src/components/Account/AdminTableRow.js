import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Auth from "./../../Auth/Auth";

function AdminTableRow(props) {
  const ctx = useContext(Auth);

  const [selectedWebsiteID, setSelectedWebsiteID] = useState("");
  const websitesSelectRef = useRef(null);

  const handleOnSelectChange = () => {
    setSelectedWebsiteID(websitesSelectRef.current.value);
  };

  const deleteWebsite = () => {
    fetch(`${ctx.fetchProviderURL}/admin/web/${selectedWebsiteID}`, {
      method: "DELETE",
      body: JSON.stringify({
        email: ctx.email,
        password: ctx.password,
      }),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong...");
        return res.json();
      })
      .then((res) => {
        if (res.status === "fail") throw new Error(res.message);
        props.onchange();
      })
      .catch((err) => console.error(err));
  };

  const deleteUser = () => {
    fetch(`${ctx.fetchProviderURL}/admin/user/`, {
      method: "DELETE",
      body: JSON.stringify({
        email: ctx.email,
        password: ctx.password,
        userEmail: props.data.user,
      }),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res) throw new Error("Something went wrong...");
        return res.json();
      })
      .then((res) => {
        if (res.status === "fail") throw new Error(res.message);
        props.onchange();
      })
      .catch((err) => console.error(err));
  };
  return (
    <tr>
      <td>{props.data.user}</td>
      <td className="delete">
        <button onClick={deleteUser}>Delete user</button>
      </td>
      <td>
        <select ref={websitesSelectRef} onChange={handleOnSelectChange}>
          <option value="">Select website</option>
          {props.data.websites.map((website) => {
            return <option value={website.id}>{website.id}</option>;
          })}
        </select>
      </td>
      <td className="delete">
        <button onClick={deleteWebsite}>Delete website</button>
      </td>
      <td>
        <a
          rel="noreferrer"
          href={
            selectedWebsiteID
              ? `${ctx.fetchProviderURL}/web/${selectedWebsiteID}`
              : "#"
          }
          target="_blank"
        >
          <button>Visit website</button>
        </a>
      </td>
    </tr>
  );
}

export default AdminTableRow;
