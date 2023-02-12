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

const getPersistedUserAuthToken = () => {
  return localStorage.getItem("userAuthToken") ?? "";
};

const getPersistedUserId = () => {
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
  const [erroring, setErroring] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState("...loading");
  const [userAuthToken, setUserAuthToken] = useState<null | string>(null);
  const [userData, setUserData] = useState<null | UserProfileDataInterface>(
    null
  );
  const [userId, setUserId] = useState<null | string>(null);

  const [isAccountVerifNavigated, setIsAccountVerifNavigated] = useState(false);
  const [userVerifModalText, setUserVerifModalText] = useState(
    "Please wait while we are verifying your profile..."
  );

  const router = useRouter();

  useEffect(() => {
    setUserAuthToken(getPersistedUserAuthToken());
    setUserId((getPersistedUserId() ?? "").toString());
  }, []);

  useEffect(() => {
    const verifUserId = router.query.userid as string;
    // parsing verification token navigation
    if (
      router.query.email != null &&
      router.query.veriftoken != null &&
      router.query.userid != null &&
      /^\d+$/.test(verifUserId)
    ) {
      setIsAccountVerifNavigated(true);
      const verifEmail = router.query.email as string;
      const urlVerifToken = router.query.veriftoken as string;
      setUserId(verifUserId);
      axios
        .put(`${usersApiEndpoint}${verifUserId}`, {
          email: verifEmail,
          verifToken: urlVerifToken,
        })
        .then((response) => {
          if (response.data == null) {
            setErroring(true);
            setTitle("...error");
          } else {
            setUserData(response.data.user);
            setTitle(response.data.user.email);
            persistUserAuthToken(response.data.token);
            persistUserId(response.data.user.id);
            setUserVerifModalText("Your profile has been verified !");
            setTimeout(() => {
              setIsAccountVerifNavigated(false);
            }, 1000);
          }
        })
        .catch((err) => {
          setErroring(true);
          setTitle("...error");
          setUserVerifModalText(
            "Sorry, we could not verify your profile, please try again later..."
          );
          setTimeout(() => {
            setIsAccountVerifNavigated(false);
          }, 1000);
        })
        .finally(() => {
          setLoading(false);
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
          if (response.data == null) {
            setErroring(true);
            setTitle("...error");
          } else {
            setUserData(response.data);
            setTitle(response.data.email);
          }
        })
        .catch((err) => {
          setErroring(true);
          setTitle("...error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthToken]);

  return (
    <MainLayout page="profile">
      <Head>
        {/* TODO show actual user email */}
        <title>
          {title} | {siteTitle} Profile
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

      {isAccountVerifNavigated && (
        <Modal>
          <div>
            <p>{userVerifModalText}</p>
          </div>
        </Modal>
      )}
    </MainLayout>
  );
}
