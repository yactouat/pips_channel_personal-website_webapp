import Head from "next/head";

import { getPostsMetadata, PostMetaData } from "@/lib/get-posts-data";
import MainLayout, { siteTitle } from "@/components/main-layout";
import utilStyles from "@/styles/utils.module.css";

/**
 *
 * static generation of the home page
 *
 * executes server-side at build time;
 * if you need to execute server-side at request time, use `getServerSideProps`;
 * also, if you need client-side data fetching, use `useSWR` instead
 *
 * @returns the list of blog posts metadata as props to pass to the Home component
 */
export async function getStaticProps() {
  try {
    return {
      props: {
        list: await getPostsMetadata(),
      },
    };
  } catch (error) {
    // TODO better observability and alerting here
    console.error(error);
    return {
      props: {
        list: [],
      },
    };
  }
}

export default function Home({ list }: { list: PostMetaData[] }) {
  return (
    <MainLayout isHomePage>
      {/* this is here that you would modify the metadata of your app' */}
      <Head>
        <title>{siteTitle} | Home</title>
        {/* scripts that need to be loaded ASAP should go here */}
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          👋 I'm Yacine, and I'm a generalist web developer who is driven by
          curiosity, positivity, and a can-do attitude; I like to design full
          stack solutions with various technologies, my objective is to have fun
          while solving problems with code! Welcome to my blog app'...
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {list.map(({ date, slug, title }) => (
            <li className={utilStyles.listItem} key={slug}>
              {title}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </MainLayout>
  );
}
