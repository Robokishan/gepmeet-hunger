import React, { ReactElement } from "react";
import { Props as DragableProp, Rnd } from "react-rnd";

interface Props extends DragableProp {
  isLocal: boolean;
  children: React.ReactElement | React.ReactNode;
  name?: string;
}

export default function Draggable({
  isLocal,
  onDrag,
  children,
  zoom = 1,
  name = "Sample",
}: Props): ReactElement {
  return (
    <Rnd
      onDrag={onDrag}
      disableDragging={!isLocal}
      enableResizing={false}
      scale={zoom}
      size={{ width: 128, height: 128 }}
      bounds="#canvas"
      style={{
        borderRadius: "50%",
      }}
    >
      <React.Fragment>
        {name && <h6>{name}</h6>}
        {children}
      </React.Fragment>
    </Rnd>
  );
}
