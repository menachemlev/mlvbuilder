import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import Auth from "../Auth/Auth";

export default function Guest(props) {
  const history = useHistory();
  const { login } = useContext(Auth);
  useEffect(() => {
    login("guest@mlvbuilder.com", "12345678", "guest");
    setTimeout(() => {
      history.push("/");
    }, 1000);
  }, []);
  return <h1> You're logged in as a guest...</h1>;
}
