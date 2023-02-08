import styles from "./modal.module.css";
import utilStyles from "./../../styles/utils.module.css";

const Modal = () => {
  return (
    <>
      <section className={`${utilStyles.hidden} ${styles.modal}`}>
        <div className={styles.flex}>
          <button className={styles.btnClose}>⨉</button>
        </div>
        <div>
          <p>modal works</p>
        </div>
      </section>
      <div className="overlay hidden"></div>
    </>
  );
};

export default Modal;
