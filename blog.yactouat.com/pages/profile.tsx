import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";
import Modal from "@/components/modal/modal";
import UserProfileDataInterface from "@/lib/interfaces/UserDataInterface";

const getUserId = () => {
  if (/^\d+$/.test(localStorage.getItem("userId") ?? "")) {
    return parseInt(localStorage.getItem("userId") ?? "");
  }
  return null;
};

const getUserToken = () => {
  return localStorage.getItem("userAuthToken") ?? "";
};

export default function Profile() {
  const [erroring, setErroring] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState("...loading");
  const [userData, setUserData] = useState<null | UserProfileDataInterface>(
    null
  );

  const [verifEmail, setVerifEmail] = useState("");
  const [verifToken, setVerifToken] = useState("");
  const [verifUserId, setVerifUserId] = useState("");
  const [isAccountVerifNavigated, setIsAccountVerifNavigated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(
      process.env.NODE_ENV === "development"
        ? `http://localhost:8080/users/${getUserId()}`
        : `https://api.yactouat.com/users/${getUserId()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUserToken()}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resPayload) => {
        if (resPayload.data == null) {
          setErroring(true);
          setTitle("...error");
        }
        console.log(resPayload.data);
        setUserData(resPayload.data);
        setLoading(false);
        setTitle(resPayload.data.email);
      })
      .catch((err) => {
        setErroring(true);
        setLoading(false);
        setTitle("...error");
      });
  }, []);

  useEffect(() => {
    // const searchParams = new URLSearchParams(
    //   window.location.href.substring(
    //     window.location.href.lastIndexOf("profile?") + 8
    //   )
    // );
    console.log(router.query);

    // const urlParams = new URLSearchParams(window.location.search);
    // urlParams.forEach((val, key) => {
    //   console.log(key, val);
    //   switch (key) {
    //     case "email":
    //       setVerifEmail(val);
    //       break;
    //     case "veriftoken":
    //       setVerifToken(val);
    //       break;
    //     case "userid":
    //       setVerifUserId(val);
    //       break;
    //     default:
    //       break;
    //   }
    //   if (verifEmail && verifToken && verifUserId) {
    //     setIsAccountVerifNavigated(true);
    //   }
    // });
  }, [router.query]);

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
            planned ... 😉
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
        <p>Sorry we have encountered an error, please try again later...</p>
      )}

      {isAccountVerifNavigated && <Modal />}
    </MainLayout>
  );
}
