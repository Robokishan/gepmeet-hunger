import React, { useState } from "react";
import { Rnd, RndDragCallback } from "react-rnd";
import "./OnlyDrag.scss";

export default function OnlyDrag(props: {
  childrenKey: string;
  x: number;
  y: number;
  children: JSX.Element;
}) {
  const [canDrag, setCanDrag] = useState(false);
  const [size, setSize] = useState(128);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const handleDrag: RndDragCallback = (e, data) => {
    e.stopPropagation();
    e.preventDefault();
  };
  // console.log(position, props)
  return (
    <Rnd
      onDrag={handleDrag}
      disableDragging={!canDrag}
      enableResizing={false}
      scale={1}
      position={{ x: position.x, y: position.y }}
      size={{ width: size, height: size }}
      className="box interactive"
      bounds="#canvas"
      style={{
        borderRadius: "50%",
      }}
    >
      <div className="content">
        {/* <div>x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)} w: {shape.w.toFixed(0)}, h: {shape.h.toFixed(0)}</div> */}
        {props.children}
      </div>
    </Rnd>
  );
}
