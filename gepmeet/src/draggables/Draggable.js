import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import React from "react";
import { v4 } from 'uuid'
import _ from 'lodash'
class Draggable extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        
        let _drag_disable = !this.props.isLocal;
        
        return (
            <Rnd
                onDrag={this.props.handleDrag}
                // onDragStop={() => {dispatch(dragResizeSlice.actions.setDragging(false))}}
                disableDragging={_drag_disable}
                enableResizing={false}
                // scale={zoom}
                // position={{x: position.x, y: position.y}}
                size={{width: 128, height: 128}}
                className="box interactive"
                bounds='#canvas'
                style={{
                borderRadius: '50%'
                }}
            >
                <div className="content">
                    {this.props.children}
                </div>
            </Rnd>
        );
    }
}

export default Draggable;
