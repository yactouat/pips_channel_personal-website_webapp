import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  deletePersistedUserData,
  getPersistedUserAuthToken,
  getPersistedUserId,
  persistUserCredentials,
} from "@/lib/functions/localStorage";
import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import Modal from "@/modules/modal/modal";
import ReadProfileData from "@/components/profile-data/read-profile-data";
import EditProfileData from "@/components/profile-data/edit-profile-data";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";

const usersApiEndpoint =
  process.env.NODE_ENV === "development"
    ? `http://localhost:8080/users/`
    : `https://api.yactouat.com/users/`;

const couldNotUpdateProfileDataTxt =
  "Sorry, we could not update your profile, please try again later...";
const errorTitle = "...error";
const fetchProfileDataErrorTxt =
  "Sorry, we could not fetch your profile data...";
const loadingOutput = "Loading...";
const profileUpdatedText = "Your profile has been updated !";

export default function Profile() {
  const router = useRouter();

  const [htmlTitle, setHtmlTitle] = useState("...loading");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackOutput, setFeedbackOutput] = useState(loadingOutput);
  const [modalText, setModalText] = useState("Loading...");

  const [userAuthToken, setUserAuthToken] = useState<null | string>(null);
  const [userData, setUserData] = useState<null | UserProfileDataInterface>(
    null
  );
  const [userHasPendingModifications, setUserHasPendingModifications] =
    useState(false);
  const [userId, setUserId] = useState<null | string>(null);

  const confirmUserProfileModToken = (
    urlUserId: string,
    urlEmail: string,
    urlToken: string,
    modtype: "veriftoken" | "modifytoken" | "deletetoken"
  ): void => {
    setIsModalOpen(true);
    let userProfileModConfirmed = false;
    axios
      .put(`${usersApiEndpoint}${urlUserId}/process-token`, {
        email: urlEmail,
        [modtype]: urlToken,
      })
      .then((response) => {
        userProfileModConfirmed = response.status === 200;
        if (userProfileModConfirmed) {
          const resPayload = response.data.data;
          setModalText(profileUpdatedText);
          persistUserCredentials(resPayload.token, resPayload.user.id);
          setHtmlTitle(resPayload.user.email);
          setFeedbackOutput(loadingOutput);
          setUserAuthToken(resPayload.token);
          setUserId(urlUserId);
          setUserData(resPayload.user);
          setUserHasPendingModifications(
            resPayload.user.hasPendingModifications
          );
        }
        if (response.status === 204) {
          setModalText("Your user profile has been deleted...");
          deletePersistedUserData();
          setHtmlTitle("...profile deleted");
          setFeedbackOutput(loadingOutput);
          setUserAuthToken(null);
          setUserData(null);
          userProfileModConfirmed = true;
        }
      })
      .catch((err) => {
        console.error("ERROR ON CONFIRMING USER PROFILE MOD", err);
      })
      .finally(() => {
        if (!userProfileModConfirmed) {
          setModalText(couldNotUpdateProfileDataTxt);
          setFeedbackOutput(fetchProfileDataErrorTxt);
          setHtmlTitle(errorTitle);
        }
        setIsLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      });
  };

  const deleteUserProfile = (): void => {
    setIsModalOpen(true);
    setModalText(loadingOutput);
    let userDeleted = false;
    axios
      .delete(`${usersApiEndpoint}${userId}`, getAuthHeaders())
      .then((response) => {
        userDeleted = response.status === 200;
        if (userDeleted) {
          setModalText(
            "Your profile deletion request has been sent, please confirm it via the link sent to your email address."
          );
          setUserHasPendingModifications(true);
        }
      })
      .catch((err) => {
        console.error("ERROR ON SENDING REQUEST TO DELETE USER PROFILE", err);
      })
      .finally(() => {
        if (!userDeleted) {
          setModalText(
            "Sorry, we could not send the request to delete your profile data ..."
          );
          setHtmlTitle(errorTitle);
        }
        setIsLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      });
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAuthToken}`,
      },
    };
  };

  const signUserIn = (): void => {
    let userFetched = false;
    axios
      .get(`${usersApiEndpoint}${userId}`, getAuthHeaders())
      .then((response) => {
        userFetched = response.status === 200;
        if (userFetched) {
          const resPayload = response.data.data;
          setHtmlTitle(resPayload.email);
          setUserData(resPayload);
          console.info("FETCHED USER PROFILE", resPayload);
          if (resPayload.hasPendingModifications == true) {
            setUserHasPendingModifications(true);
          }
        }
      })
      .catch((err) => {
        console.error("ERROR ON FETCHING USER PROFILE", err);
      })
      .finally(() => {
        if (!userFetched) {
          setFeedbackOutput(fetchProfileDataErrorTxt);
          setHtmlTitle(errorTitle);
          deletePersistedUserData();
        }
        setIsLoading(false);
      });
  };

  const toggleEditMode = (): void => {
    setIsEditMode((prevState) => !prevState);
  };

  const updateUserProfile = (
    updatedUserData: UserProfileDataInterface
  ): void => {
    setIsModalOpen(true);
    setModalText(loadingOutput);
    let userUpdated = false;
    axios
      .put(`${usersApiEndpoint}${userId}`, updatedUserData, getAuthHeaders())
      .then((response) => {
        userUpdated = response.status === 200;
        if (userUpdated) {
          const resPayload = response.data.data;
          let feedbackText = profileUpdatedText;
          if (
            updatedUserData.email !== userData?.email ||
            (updatedUserData.password ?? "" != "")
          ) {
            feedbackText =
              "Your profile has been updated ! some email confirmation may be required";
            setUserHasPendingModifications(true);
          }
          setModalText(feedbackText);
          persistUserCredentials(resPayload.token, resPayload.user.id);
          setFeedbackOutput(loadingOutput);
          setUserAuthToken(resPayload.token);
          setUserData(resPayload.user);
          toggleEditMode();
        }
      })
      .catch((err) => {
        console.error("ERROR ON UPDATING USER PROFILE", err);
      })
      .finally(() => {
        if (!userUpdated) {
          setModalText(couldNotUpdateProfileDataTxt);
          setFeedbackOutput(fetchProfileDataErrorTxt);
          setHtmlTitle(errorTitle);
        }
        setIsLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      });
  };

  // checking if there is a persisted user auth token and user id at page load
  useEffect(() => {
    setUserAuthToken(getPersistedUserAuthToken());
    setUserId((getPersistedUserId() ?? "").toString());
  }, []);

  // parsing verification token navigation
  useEffect(() => {
    let urlEmail;
    let urlToken;
    let urlUserId: string;
    let modType: "veriftoken" | "modifytoken" | "deletetoken";
    if (process.env.NODE_ENV === "development") {
      const queryStrings = new URL(window.location.href).searchParams;
      urlToken =
        (queryStrings.get("veriftoken") as string) ??
        (queryStrings.get("modifytoken") as string) ??
        (queryStrings.get("deletetoken") as string) ??
        "";
      modType = queryStrings.get("veriftoken")
        ? "veriftoken"
        : queryStrings.get("modifytoken")
        ? "modifytoken"
        : "deletetoken";
      urlEmail = queryStrings.get("email") as string;
      urlUserId = queryStrings.get("userid") as string;
    } else {
      urlToken =
        (router.query.veriftoken as string) ??
        (router.query.modifytoken as string) ??
        (router.query.deletetoken as string) ??
        "";
      modType = router.query.veriftoken
        ? "veriftoken"
        : router.query.modifytoken
        ? "modifytoken"
        : "deletetoken";
      urlEmail = router.query.email as string;
      urlUserId = router.query.userid as string;
    }
    if (
      urlEmail != null &&
      urlToken != null &&
      urlUserId != null &&
      /^\d+$/.test(urlUserId)
    ) {
      confirmUserProfileModToken(urlUserId, urlEmail, urlToken, modType);
    }
  }, [router.query]);

  // signing user in on setting the auth token in the component state
  useEffect(() => {
    if (userAuthToken && userId && !userData) {
      // auto sign in
      signUserIn();
    } else if (!userData) {
      setHtmlTitle(errorTitle);
      setFeedbackOutput(fetchProfileDataErrorTxt);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthToken]);

  return (
    <MainLayout page="profile">
      <Head>
        <title>
          {htmlTitle} | {siteTitle} Profile
        </title>
        {/* scripts that need to be loaded ASAP should go here */}
        <meta name="robots" content="noindex" />
      </Head>
      {(isLoading || !userData) && <p>{feedbackOutput}</p>}

      {!isLoading && userData != null && !isEditMode && (
        <ReadProfileData userData={userData} toggleEditMode={toggleEditMode} />
      )}

      {!isLoading && userData != null && isEditMode && (
        <EditProfileData
          deleteUserProfile={deleteUserProfile}
          toggleEditMode={toggleEditMode}
          updateUserProfile={updateUserProfile}
          userData={userData}
          userHasPendingModifications={userHasPendingModifications}
        />
      )}

      {isModalOpen && (
        <Modal>
          <div>
            <p>{modalText}</p>
          </div>
        </Modal>
      )}
    </MainLayout>
  );
}
