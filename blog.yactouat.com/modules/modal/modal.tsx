import styles from "./modal.module.css";
import ModalProps from "./ModalProps";

const Modal = ({ children }: ModalProps) => {
  return (
    <>
      <section className={`${styles.modal}`}>{children}</section>
      <div className="overlay"></div>
    </>
  );
};

export default Modal;
