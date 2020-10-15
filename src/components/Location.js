import React from "react";
import "./Location.css";

export default function Location(props) {
  const { name, NPA } = props;

  return (
    <div className="location">
      <h2>{NPA}</h2>
      <div>{name}</div>
    </div>
  );
}
