import React from 'react'
import ReactModal from 'react-modal'

const Modal = (props: { id: string, children: JSX.Element, isOpen: boolean }) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      contentLabel={`${props.id} Modal`}
    >
      {props.children}
    </ReactModal>
  )
}

export const ModalStyle : {
  overlay: {
      backgroundColor: string;
      position: 'absolute';
  };
  content: {
      top: string;
      left: string;
      right: string;
      bottom: string;
      marginRight: string;
      transform: string;
      boxShadow: string;
      background: string;
      color: string;
      border: string;
      borderRadius: string;
  };
} = {
  overlay: {
    backgroundColor : 'rgba(0, 0, 0, 0.5)',
    position        : 'absolute',
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    boxShadow             : '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    background            : '#282A32',
    color                 : '#fefefe',
    border                : 'none',
    borderRadius          : '0.3rem',
  }
};
export default Modal