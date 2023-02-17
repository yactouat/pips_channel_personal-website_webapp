import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";
import utilStyles from "@/styles/utils.module.css";

const ReadProfileData = ({
  userData,
}: {
  userData: UserProfileDataInterface;
}) => {
  // TODO toggle edition mode from parent component
  const toggleEditable = () => {
    console.log("I am clicked");
  };

  return (
    <section className={`${utilStyles.headingMd}`}>
      <p>
        Welcome to your private profile page ! I have exicting new features
        planned ... stay tuned ! 😉
      </p>
      <hr />
      <h2>
        your personal data{" "}
        <span className="editable" onClick={toggleEditable}>
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
