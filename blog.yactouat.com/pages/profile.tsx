import Head from "next/head";
import { useState, useEffect } from "react";
import useSWR from "swr";

import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";

// export default function Profile({}: {}) {
export default function Profile() {
  // TODO use SWR to fetch profile data
  // const { data, error } = useSWR(
  //   "/api/profile-data",
  //   () => fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) =>
  //     res.json()
  //   )
  // );
  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  // TODO handle missing data
  // const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // TODO fetch profile data from API
    // fetch("/api/profile-data")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setData(data);
    //     setLoading(false);
    //   });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <MainLayout page="profile">
      <Head>
        {/* TODO show actual user email */}
        <title>me@domain.com | {siteTitle} Profile</title>
        {/* scripts that need to be loaded ASAP should go here */}
        <meta name="robots" content="noindex" />
      </Head>
      {!isLoading && (
        <section className={utilStyles.headingMd}>
          <p>
            Welcome to your private profile page ! it's pretty empty for now but
            I have exicting new features planned ... 😉
          </p>
        </section>
      )}
      {isLoading && <p>Loading...</p>}
    </MainLayout>
  );
}
