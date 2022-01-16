import React, { useState } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import "./basicDiv.scss";

export default function BasicDiv(props: {
  id: string;
  w: number;
  dragHandle: boolean;
  h: number;
  x: number;
  y: number;
  onDeleteTrigger: undefined | (() => void);
  children: JSX.Element;
}) {
  const [canDrag, setCanDrag] = useState(false);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [shape, setShape] = useState({ w: props.w, h: props.h });
  const handleDrag: RndDragCallback = (e, data) => {
    e.stopPropagation();
    e.preventDefault();
  };
  // console.log(position, props)

  const onResize: RndResizeCallback = (e, dir, ref, delta, position) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragHandleClass = props.dragHandle ? "handle" + props.id : undefined;
  return (
    <Rnd
      onDrag={handleDrag}
      onResize={onResize}
      disableDragging={!canDrag}
      enableResizing={canDrag}
      lockAspectRatio={true}
      scale={1}
      bounds="#canvas"
      dragHandleClassName={dragHandleClass}
      position={{ x: position.x, y: position.y }}
      size={{ width: shape.w, height: shape.h }}
      className="box interactive"
    >
      <div className="content">
        <div className="cross">
          {props.onDeleteTrigger && (
            <div className="close" onClick={props.onDeleteTrigger}>
              <span className="material-icons">close</span>
            </div>
          )}
          {props.dragHandle && (
            <div className={dragHandleClass}>
              <span className="material-icons">drag_handle</span>
            </div>
          )}
        </div>
        {/* <div>x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)} w: {shape.w.toFixed(0)}, h: {shape.h.toFixed(0)}</div> */}
        {props.children}
      </div>
    </Rnd>
  );
}
