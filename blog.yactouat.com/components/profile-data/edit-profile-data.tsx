import styles from "./profile-data.module.css";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";
import utilStyles from "@/styles/utils.module.css";

const EditProfileData = ({
  userData,
  toggleEditMode,
}: {
  userData: UserProfileDataInterface;
  toggleEditMode: () => void;
}) => {
  return (
    <section className={`${utilStyles.headingMd}`}>
      <hr />
      <h2 className={styles.h2}>
        edit your personal profile data{" "}
        <span className="editable" onClick={toggleEditMode}>
          {" "}
        </span>
      </h2>
      <p>email: {userData.email}</p>
      <p>
        social handle: <b>{userData.socialhandle}</b> on{" "}
        <b>{userData.socialhandletype}</b>
      </p>
      {/* TODO add relevant form here */}
      <hr />
    </section>
  );
};

export default EditProfileData;
