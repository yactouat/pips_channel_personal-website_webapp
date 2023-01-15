import Head from "next/head";
import Link from "next/link";

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
  console.log(postData);
  return {
    props: {
      postData,
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
      {postData.title}
      <br />
      {postData.slug}
      <br />
      {postData.date}
      <h2>
        {/* using`Link` here allows to perform client-side navigation, 
          it also triggers pre fetching browser features in production builds 
        */}
        <Link href="/">back</Link>
      </h2>
    </MainLayout>
  );
}
