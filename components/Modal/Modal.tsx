import React from 'react';
import s from './Modal.module.scss';

interface Props {
  isShow: boolean;
  children: React.ReactNode;
}

const Modal = ({ isShow, children }: Props) => {
  return isShow ? (
    <div className={s.modalWrap}>
      <div className={s.modalBackdrop} />
      {/* <div className={s.modalContent}> */}
      {children}
      {/* </div> */}
    </div>
  ) : null;
};

export default Modal;
