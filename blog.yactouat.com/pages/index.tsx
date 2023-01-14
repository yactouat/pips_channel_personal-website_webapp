import Head from "next/head";

import MainLayout, { siteTitle } from "@/components/main-layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <MainLayout isHomePage>
      {/* this is here that you would modify the metadata of your app' */}
      <Head>
        <title>{siteTitle} | Home</title>
        {/* scripts that need to be loaded ASAP should go here */}
      </Head>
      <main>
        <section className={utilStyles.headingMd}>
          <p>
            I'm a generalist web developer who is driven by curiosity,
            positivity, and a can-do attitude; I like to design full stack
            solutions with various technologies, my objective is to have fun
            while solving problems with code!
          </p>
        </section>
      </main>
    </MainLayout>
  );
}
