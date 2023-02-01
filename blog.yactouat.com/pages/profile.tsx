import Head from "next/head";

import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";

// TODO do not user SSR here, use SSG instead
// export async function getStaticProps() {
//   try {
//     return {
//       props: {},
//     };
//   } catch (error) {
//     // TODO better observability and alerting here
//     console.error(error);
//     return {
//       props: {},
//     };
//   }
// }

// export default function Profile({}: {}) {
export default function Profile() {
  return (
    <MainLayout page="profile">
      <Head>
        {/* TODO show actual user email */}
        <title>me@domain.com | {siteTitle} Profile</title>
        {/* scripts that need to be loaded ASAP should go here */}
        <meta name="robots" content="noindex" />
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Welcome to your private profile page ! it's pretty empty for now but I
          have exicting new features planned ... 😉
        </p>
      </section>
    </MainLayout>
  );
}
