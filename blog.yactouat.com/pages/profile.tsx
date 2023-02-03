import Head from "next/head";
import { useState, useEffect } from "react";

import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";
import { SocialHandleType } from "pips_resources_definitions/dist/types";

const getUserId = () => {
  if (/^\d+$/.test(localStorage.getItem("userId") ?? "")) {
    return parseInt(localStorage.getItem("userId") ?? "");
  }
  return null;
};

const getUserToken = () => {
  return localStorage.getItem("userToken") ?? "";
};

interface UserDataInterface {
  email: string;
  socialhandle: string;
  socialhandletype: SocialHandleType;
}

export default function Profile() {
  const [erroring, setErroring] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState("...loading");
  const [userData, setUserData] = useState(null);

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
          <p>email: {(userData as UserDataInterface).email}</p>
          <p>
            social handle: <b>{(userData as UserDataInterface).socialhandle}</b>{" "}
            on <b>{(userData as UserDataInterface).socialhandletype}</b>
          </p>
          <hr />
        </section>
      )}

      {!isLoading && erroring && (
        <p>Sorry we have encountered an error, please try again later...</p>
      )}
    </MainLayout>
  );
}
