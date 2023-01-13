import React from "react";

const BattleGridSquare = ({ square, i, j, handleHover, handleClick }) => {

  if (square.status === "label") {
    return <div className="grid-square label">{square.label}</div>;
  }



  return (
    <div
      onMouseEnter={() => handleHover(i, j, "enter")}
      onMouseLeave={() => handleHover(i, j, "leave")}
      onClick={() => handleClick(i, j)}
    />
  );

};

export default BattleGridSquare;