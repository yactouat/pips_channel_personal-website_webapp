import Head from "next/head";
import html from "remark-html";
import Link from "next/link";
import { remark } from "remark";

import getAllPostsSlugs from "@/lib/get-all-posts-slugs";
import { getPostData, PostData } from "@/lib/get-posts-data";
import MainLayout, { siteTitle } from "@/components/main-layout";

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
  console.log(postData);
  return (
    <MainLayout>
      <Head>
        <title>
          {siteTitle} | {postData.slug}
        </title>
      </Head>
      {postData.title}
      <br />
      {postData.slug}
      <br />
      {postData.date}
      <div dangerouslySetInnerHTML={{ __html: postData.contents }} />
      <h2>
        {/* using`Link` here allows to perform client-side navigation, 
          it also triggers pre fetching browser features in production builds 
        */}
        <Link href="/">back</Link>
      </h2>
    </MainLayout>
  );
}
