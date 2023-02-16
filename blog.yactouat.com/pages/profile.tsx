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
import Modal from "@/components/modal/modal";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";
import ProfileData from "@/components/profile-data";

const usersApiEndpoint =
  process.env.NODE_ENV === "development"
    ? `http://localhost:8080/users/`
    : `https://api.yactouat.com/users/`;

const errorOutput = "Sorry, we could not fetch your profile data...";
const loadingOutput = "Loading...";

export default function Profile() {
  const router = useRouter();

  const [htmlTitle, setHtmlTitle] = useState("...loading");
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

  // checking if there is a persisted user auth token and user id at page load
  useEffect(() => {
    setUserAuthToken(getPersistedUserAuthToken());
    setUserId((getPersistedUserId() ?? "").toString());
  }, []);

  // parsing verification token navigation
  useEffect(() => {
    const verifUserId = router.query.userid as string;
    if (
      router.query.email != null &&
      router.query.veriftoken != null &&
      router.query.userid != null &&
      /^\d+$/.test(verifUserId)
    ) {
      setIsModalOpen(true);
      const verifEmail = router.query.email as string;
      const urlVerifToken = router.query.veriftoken as string;
      axios
        .put(`${usersApiEndpoint}${verifUserId}`, {
          email: verifEmail,
          verifToken: urlVerifToken,
        })
        .then((response) => {
          console.log("verif response", response);
          const resPayload = response.data.data;
          if (resPayload == null) {
            setHtmlTitle("...error");
            setFeedbackOutput(loadingOutput);
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
          setHtmlTitle("...error");
          deletePersistedUserData();
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => {
            setIsModalOpen(false);
          }, 2000);
        });
    }
  }, [router.query]);

  useEffect(() => {
    if (userAuthToken && userId && !userData) {
      // auto sign in
      axios
        .get(`${usersApiEndpoint}${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
        })
        .then((response) => {
          const resPayload = response.data.data;
          console.log(resPayload);
          if (resPayload == null) {
            setFeedbackOutput(errorOutput);
            setHtmlTitle("...error");
          } else {
            setHtmlTitle(resPayload.email);
            setUserData(resPayload);
          }
        })
        .catch((err) => {
          setFeedbackOutput(errorOutput);
          setHtmlTitle("...error");
          deletePersistedUserData();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!userData) {
      setHtmlTitle("...error");
      setFeedbackOutput(errorOutput);
      setIsLoading(false);
      deletePersistedUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthToken]);

  return (
    <MainLayout page="profile">
      <Head>
        {/* TODO show actual user email */}
        <title>
          {htmlTitle} | {siteTitle} Profile
        </title>
        {/* scripts that need to be loaded ASAP should go here */}
        <meta name="robots" content="noindex" />
      </Head>
      {(isLoading || !userData) && <p>{feedbackOutput}</p>}

      {!isLoading && userData != null && <ProfileData userData={userData} />}

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
