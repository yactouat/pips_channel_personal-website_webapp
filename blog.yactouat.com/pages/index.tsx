import Head from "next/head";

import MainLayout, { siteTitle } from "@/components/main-layout";
import utilStyles from "@/styles/utils.module.css";

interface BlogPostMetaData {
  date: string;
  slug: string;
  title: string;
}

interface HomeProps {
  props: {
    list: BlogPostMetaData[];
  };
}

export async function getStaticProps(): Promise<HomeProps> {
  try {
    const blogPostsMetadataAPICall = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/blog-posts"
        : "https://api.yactouat.com/blog-posts"
    );
    const blogPostsMetadataJSON = await blogPostsMetadataAPICall.json();
    const blogPostsMetadata = await blogPostsMetadataJSON.data;
    return {
      props: {
        list: blogPostsMetadata,
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

export default function Home(props: HomeProps) {
  const blogPostsMetadata = props.list;
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
          {blogPostsMetadata.map(({ date, slug, title }) => (
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
