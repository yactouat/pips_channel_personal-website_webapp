import Head from "next/head";
import Link from "next/link";

import MainLayout, { siteTitle } from "@/components/main-layout";
import getAllPostsSlugs from "@/lib/get-all-posts-slugs";

// getting all possible slugs for posts in order to generate static pages
export async function getStaticPaths() {
  const paths = getAllPostsSlugs();
  return {
    paths,
    fallback: false,
  };
}

export default function Post() {
  return (
    <MainLayout>
      <Head>
        <title>{siteTitle} | First Post</title>
      </Head>
      <h2>First Post</h2>
      <h2>
        {/* using`Link` here allows to perform client-side navigation, 
          it also triggers pre fetching browser features in production builds 
        */}
        <Link href="/">back</Link>
      </h2>
    </MainLayout>
  );
}
