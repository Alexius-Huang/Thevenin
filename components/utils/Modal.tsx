import React from 'react';
import classnames from 'classnames';
import './Modal.scss';

export type ModalProps = {
  width?: number;
  height?: number;
  className?: string;
  active: boolean;
};

const Modal: React.FC<ModalProps> = ({ width, height, active, children, className }) => {
  const innerModalStyle: { [key: string]: string } = {
    width: '30vw',
    height: '30vh',
  };

  if (width) innerModalStyle.width = `${width}px`;
  if (height) innerModalStyle.height = `${height}px`;

  const modalClass = classnames('modal-wrapper', className, { active });

  return (
    <div className={modalClass}>
      <div className="inner-modal" style={innerModalStyle}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
