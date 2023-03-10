import { FormEventHandler, MouseEventHandler, useState } from "react";
import { SocialHandleType } from "pips_resources_definitions/dist/types";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";

import styles from "./profile-data.module.css";
import utilStyles from "@/styles/utils.module.css";

const EditProfileData = ({
  deleteUserProfile,
  toggleEditMode,
  updateUserProfile,
  userData,
  userHasPendingModifications,
}: {
  deleteUserProfile: () => void;
  toggleEditMode: () => void;
  updateUserProfile: (updatedUserData: UserProfileDataInterface) => void;
  userData: UserProfileDataInterface;
  userHasPendingModifications: boolean;
}) => {
  const [userEmail, setUserEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [userSocialHandle, setUserSocialHandle] = useState(
    userData.socialhandle
  );
  const [userSocialHandleType, setUserSocialHandleType] = useState(
    userData.socialhandletype
  );

  const handleDelete: MouseEventHandler = (e) => {
    e.preventDefault();
    deleteUserProfile();
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    let updatePayload: UserProfileDataInterface = {
      email: userEmail,
      socialhandle: userSocialHandle,
      socialhandletype: userSocialHandleType,
    };
    if (password != "") {
      updatePayload.password = password;
    }
    updateUserProfile(updatePayload);
  };

  return (
    <section className={`${utilStyles.headingMd}`}>
      <hr />
      <h2 className={styles.h2}>
        edit your personal profile data{" "}
        <span
          className="readable"
          onClick={toggleEditMode}
          title="read profile data"
        >
          {" "}
        </span>
      </h2>

      <form onSubmit={handleSubmit} method="POST">
        <div className={`${styles.field}`}>
          <span className={utilStyles.marginRight}>email:</span>{" "}
          <input
            className={utilStyles.padding}
            name="userEmail"
            onChange={(e) => setUserEmail(e.target.value)}
            type="email"
            value={userEmail}
          />
        </div>

        <div>
          <p className={styles.field}>
            <span className={utilStyles.marginRight}>social handle:</span>{" "}
            <input
              className={`${utilStyles.marginRight} ${utilStyles.padding}`}
              name="userSocialHandle"
              onChange={(e) => setUserSocialHandle(e.target.value)}
              type="text"
              value={userSocialHandle}
            />{" "}
            <span className={utilStyles.marginRight}>on</span>{" "}
            <select
              className={utilStyles.padding}
              name="userSocialHandleType"
              onChange={(e) =>
                setUserSocialHandleType(e.target.value as SocialHandleType)
              }
              value={userSocialHandleType}
            >
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </p>
        </div>

        <div className={styles.field}>
          <span className={utilStyles.marginRight}>password:</span>{" "}
          <input
            className={utilStyles.padding}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </div>
        <p className={`${utilStyles.smallerText}`}>
          ?????? password not shown for safety reasons - ?????? password should be 8
          characters or longer, and should contain at least 1 number, 1
          uppercase letter and 1 lowercase letter
        </p>

        <div className={`${utilStyles.flex} ${utilStyles.spaceBetween}`}>
          <input
            type="submit"
            value="save"
            className={`${utilStyles.padding} ${utilStyles.largerText} ${utilStyles.marginBottomX2} ${utilStyles.marginTopX2}`}
          />
          <button
            className={`${utilStyles.padding} ${utilStyles.largerText} ${utilStyles.marginBottomX2} ${utilStyles.marginTopX2} ${styles.deleteProfileBtn}`}
            onClick={(e) => handleDelete(e)}
          >
            delete profile
          </button>
        </div>
      </form>

      <hr />

      {userHasPendingModifications && (
        <>
          <p>
            ?????? your profile has pending modifications that require to be
            confirmed via an email sent to your inbox
          </p>

          <hr />
        </>
      )}
    </section>
  );
};

export default EditProfileData;
