import React from "react";
import { Rnd, RndDragCallback } from "react-rnd";

interface Props {
  isLocal: boolean;
  handleDrag?: RndDragCallback;
  children: React.ReactElement | React.ReactNode;
  position?: {
    x: number;
    y: number;
  };
}

const Draggable = ({ isLocal, handleDrag, position, children }: Props) => {
  return (
    <Rnd
      onDrag={handleDrag}
      // onDragStop={() => {dispatch(dragResizeSlice.actions.setDragging(false))}}
      disableDragging={!isLocal}
      enableResizing={false}
      // scale={zoom}
      position={position && { x: position.x, y: position.y }}
      size={{ width: 150, height: 150 }}
      className="box interactive"
      bounds="#canvas"
      style={{
        borderRadius: "50%",
      }}
    >
      <div className="content">{children}</div>
    </Rnd>
  );
};

export default Draggable;
