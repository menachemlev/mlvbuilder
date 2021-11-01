import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import Auth from "./../Auth/Auth";
function UserWebsite() {
  const ctx = useContext(Auth);
  const params = useParams();
  document.write();
  useEffect(() => {
    fetch(`${ctx.fetchProviderURL}/web/${params.id}`)
      .then((res) => {
        if (!res) throw new Error("Something went wrong");
        return res.json();
      })
      .then((res) => {
        if (res.status === "fail") throw new Error(res.message);
        document.write(res.html);
        const checkIfLandspaceAndUpdate = () => {
          if (window.innerHeight > window.innerWidth) {
            //portrait
            document.querySelectorAll(".portrait").forEach((div) => {
              div.style.display = "block";
            });
            document.querySelectorAll(".landspace").forEach((div) => {
              div.style.display = "none";
            });
          } else {
            //landspace
            document.querySelectorAll(".portrait").forEach((div) => {
              div.style.display = "none";
            });
            document.querySelectorAll(".landspace").forEach((div) => {
              div.style.display = "block";
            });
          }
        };
        checkIfLandspaceAndUpdate();
        setInterval(checkIfLandspaceAndUpdate, 1000);
        window.addEventListener("orientationchange", checkIfLandspaceAndUpdate);
      })
      .catch((err) => console.error(err));
  }, []);

  return <></>;
}
export default UserWebsite;
