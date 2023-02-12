import styles from "./modal.module.css";

const Modal = () => {
  return (
    <>
      <section className={`${styles.modal}`}>
        <div>
          <p>modal works</p>
        </div>
      </section>
      <div className="overlay"></div>
    </>
  );
};

export default Modal;
