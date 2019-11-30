import React from 'react';
import Modal from './Modal';
import './Modal.Error.scss';

export type ErrorModalProps = {
  title?: string;
  message: string;
  active: boolean;
  onConfirm: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ active, title, message, onConfirm }) => {  
  return (
    <Modal active={active} className="error-modal">
      <div className="content-wrapper">
        {title && <h2 className="message-title">{title}</h2>}
        <p className="message-wrapper">{message}</p>

        <button className="confirm-btn" onClick={onConfirm}>OK</button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
