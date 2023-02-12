import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";
import Modal from "@/components/modal/modal";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";

const usersApiEndpoint =
  process.env.NODE_ENV === "development"
    ? `http://localhost:8080/users/`
    : `https://api.yactouat.com/users/`;

const getPersistedUserAuthToken = (): string => {
  return localStorage.getItem("userAuthToken") ?? "";
};

const getPersistedUserId = (): number | null => {
  if (/^\d+$/.test(localStorage.getItem("userId") ?? "")) {
    return parseInt(localStorage.getItem("userId") ?? "");
  }
  return null;
};

const persistUserAuthToken = (userAuthToken: string): void => {
  localStorage.setItem("userAuthToken", userAuthToken);
};

const persistUserId = (userId: number): void => {
  localStorage.setItem("userId", userId.toString());
};

export default function Profile() {
  const router = useRouter();

  const [erroring, setErroring] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [htmlTitle, setHtmlTitle] = useState("...loading");

  const [userAuthToken, setUserAuthToken] = useState<null | string>(null);
  const [userData, setUserData] = useState<null | UserProfileDataInterface>(
    null
  );
  const [userId, setUserId] = useState<null | string>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState(
    "Please wait while we are verifying your profile..."
  );

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
            setErroring(true);
            setHtmlTitle("...error");
          } else {
            setModalText("Your profile has been verified !");
            persistUserAuthToken(resPayload.token);
            persistUserId(resPayload.user.id);
            setErroring(false);
            setHtmlTitle(resPayload.user.email);
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
          setErroring(true);
          setHtmlTitle("...error");
        })
        .finally(() => {
          setLoading(false);
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
            setErroring(true);
            setHtmlTitle("...error");
          } else {
            setErroring(false);
            setHtmlTitle(resPayload.email);
            setUserData(resPayload);
          }
        })
        .catch((err) => {
          setErroring(true);
          setHtmlTitle("...error");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!userData) {
      setErroring(true);
      setLoading(false);
      setHtmlTitle("...error");
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
      {isLoading && !erroring && <p>Loading...</p>}

      {!isLoading && !erroring && userData != null && (
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
      )}

      {!isLoading && erroring && (
        <p>
          Sorry we cannot fetch your profile data, please try again later...
        </p>
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
