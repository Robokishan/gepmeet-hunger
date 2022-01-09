import { ReactElement } from "react";
import { Rnd } from "react-rnd";
import _ from "lodash";

interface Props {
  isLocal: boolean;
  handleDrag?: any;
  children: React.ReactElement | React.ReactNode;
}

export default function Draggable({
  isLocal,
  handleDrag,
  children,
}: Props): ReactElement {
  return (
    <Rnd
      onDrag={handleDrag}
      // onDragStop={() => {dispatch(dragResizeSlice.actions.setDragging(false))}}
      disableDragging={!isLocal}
      enableResizing={false}
      // scale={zoom}
      // position={{x: position.x, y: position.y}}
      size={{ width: 128, height: 128 }}
      className="box interactive"
      bounds="#canvas"
      style={{
        borderRadius: "50%",
      }}
    >
      <div className="content">{children}</div>
    </Rnd>
  );
}
