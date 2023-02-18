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

const errorOutput = "Sorry, we could not fetch your profile data...";
const errorTitle = "...error";
const loadingOutput = "Loading...";

export default function Profile() {
  const router = useRouter();

  const [htmlTitle, setHtmlTitle] = useState("...loading");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackOutput, setFeedbackOutput] = useState(loadingOutput);
  const [modalText, setModalText] = useState(
    "Please wait while we are verifying your profile..."
  );

  const [userAuthToken, setUserAuthToken] = useState<null | string>(null);
  const [userData, setUserData] = useState<null | UserProfileDataInterface>(
    null
  );
  const [userId, setUserId] = useState<null | string>(null);

  const getAuthHeaders = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAuthToken}`,
      },
    };
  };

  const signUserIn = (): void => {
    axios
      .get(`${usersApiEndpoint}${userId}`, getAuthHeaders())
      .then((response) => {
        const resPayload = response.data.data;
        console.log(resPayload);
        if (resPayload == null) {
          setFeedbackOutput(errorOutput);
          setHtmlTitle(errorTitle);
        } else {
          setHtmlTitle(resPayload.email);
          setUserData(resPayload);
        }
      })
      .catch((err) => {
        setFeedbackOutput(errorOutput);
        setHtmlTitle(errorTitle);
        deletePersistedUserData();
      })
      .finally(() => {
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
    axios
      .put(`${usersApiEndpoint}${userId}`, updatedUserData, getAuthHeaders())
      .then((response) => {
        console.info("UPDATE USER", response.data);
        const resPayload = response.data.data;
        if (resPayload == null) {
          setHtmlTitle(errorTitle);
          setFeedbackOutput(
            "Sorry, we could not verify your profile, please try again later..."
          );
        } else {
          setModalText("Your profile has been updated !");
          persistUserCredentials(resPayload.token, resPayload.user.id);
          setFeedbackOutput(loadingOutput);
          setUserAuthToken(resPayload.token);
          setUserData(resPayload.user);
          toggleEditMode();
        }
      })
      .catch((err) => {
        console.error(err);
        setModalText(
          "Sorry, we could not update your profile, please try again later..."
        );
        setFeedbackOutput(errorOutput);
        setHtmlTitle(errorTitle);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      });
  };

  const verifyUserProfile = (
    verifUserId: string,
    verifEmail: string,
    urlVerifToken: string
  ): void => {
    setIsModalOpen(true);
    axios
      .put(`${usersApiEndpoint}${verifUserId}/verify`, {
        email: verifEmail,
        veriftoken: urlVerifToken,
      })
      .then((response) => {
        console.info("VERIF USER", response.data);
        const resPayload = response.data.data;
        if (resPayload == null) {
          setHtmlTitle(errorTitle);
          setFeedbackOutput(errorOutput);
        } else {
          setModalText("Your profile has been verified !");
          persistUserCredentials(resPayload.token, resPayload.user.id);
          setHtmlTitle(resPayload.user.email);
          setFeedbackOutput(loadingOutput);
          setUserAuthToken(resPayload.token);
          setUserId(verifUserId);
          setUserData(resPayload.user);
        }
      })
      .catch((err) => {
        console.error(err);
        setModalText(
          "Sorry, we could not verify your profile, please try again later..."
        );
        setFeedbackOutput(errorOutput);
        setHtmlTitle(errorTitle);
      })
      .finally(() => {
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
    let verifEmail;
    let urlVerifToken;
    let verifUserId: string;
    if (process.env.NODE_ENV === "development") {
      const queryStrings = new URL(window.location.href).searchParams;
      urlVerifToken = queryStrings.get("veriftoken") as string;
      verifEmail = queryStrings.get("email") as string;
      verifUserId = queryStrings.get("userid") as string;
    } else {
      urlVerifToken = router.query.veriftoken as string;
      verifEmail = router.query.email as string;
      verifUserId = router.query.userid as string;
    }
    if (
      verifEmail != null &&
      urlVerifToken != null &&
      verifUserId != null &&
      /^\d+$/.test(verifUserId)
    ) {
      verifyUserProfile(verifUserId, verifEmail, urlVerifToken);
    }
  }, [router.query]);

  useEffect(() => {
    if (userAuthToken && userId && !userData) {
      // auto sign in
      signUserIn();
    } else if (!userData) {
      setHtmlTitle(errorTitle);
      setFeedbackOutput(errorOutput);
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
          toggleEditMode={toggleEditMode}
          updateUserProfile={updateUserProfile}
          userData={userData}
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
