import "./Card.css";
function Card(props) {
  return <div className="UI-card">{props.children}</div>;
}

export default Card;
