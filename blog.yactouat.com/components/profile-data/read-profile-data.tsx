import styles from "./profile-data.module.css";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";
import utilStyles from "@/styles/utils.module.css";

const ReadProfileData = ({
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
        your personal profile data{" "}
        <span
          className="editable"
          onClick={toggleEditMode}
          title="edit profile data"
        >
          {" "}
        </span>
      </h2>
      <p>email: {userData.email}</p>
      <p>
        social handle: <b>{userData.socialhandle}</b> on{" "}
        <b>{userData.socialhandletype}</b>
      </p>
      <p>
        profile is verified: <b>{userData.verified ? "✅" : "❌"}</b>
        {!userData.verified && (
          <p>
            ⚠️ please click on the verification link sent to your mailbox to
            verify your profile
          </p>
        )}
      </p>
      <hr />
    </section>
  );
};

export default ReadProfileData;
