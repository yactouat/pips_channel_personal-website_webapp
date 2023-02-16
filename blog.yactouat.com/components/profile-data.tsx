import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";
import utilStyles from "../styles/utils.module.css";

const ProfileData = ({ userData }: { userData: UserProfileDataInterface }) => {
  return (
    <section className={utilStyles.headingMd}>
      <p>
        Welcome to your private profile page ! I have exicting new features
        planned ... stay tuned ! 😉
      </p>
      <hr />
      <h2>your personal data</h2>
      <p>email: {userData.email}</p>
      <p>
        social handle: <b>{userData.socialhandle}</b> on{" "}
        <b>{userData.socialhandletype}</b>
      </p>
      <hr />
    </section>
  );
};

export default ProfileData;
