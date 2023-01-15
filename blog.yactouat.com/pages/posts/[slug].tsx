import Head from "next/head";
import html from "remark-html";
import { remark } from "remark";

import Date from "@/components/date";
import getAllPostsSlugs from "@/lib/get-all-posts-slugs";
import { getPostData, PostData } from "@/lib/get-posts-data";
import MainLayout, { siteTitle } from "@/components/main-layout/main-layout";
import utilStyles from "@/styles/utils.module.css";

// getting all possible slugs for posts in order to generate static pages
export async function getStaticPaths() {
  const paths = await getAllPostsSlugs();
  return {
    paths,
    fallback: false,
  };
}

// getting post data for a specific slug to generate the blog post page
export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.slug);
  const processedPostContents = (
    await remark().use(html).process(postData.contents)
  ).toString();
  const processedPostData = {
    ...postData,
    contents: processedPostContents,
  };
  return {
    props: {
      postData: processedPostData,
    },
  };
}

export default function Post({ postData }: { postData: PostData }) {
  return (
    <MainLayout>
      <Head>
        <title>
          {siteTitle} | {postData.slug}
        </title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contents }} />
      </article>
    </MainLayout>
  );
}
