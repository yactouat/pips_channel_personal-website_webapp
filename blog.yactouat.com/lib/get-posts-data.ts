import { BlogPostResource } from "pips_resources_definitions/dist/resources";

export const getPostData = async (slug: string): Promise<BlogPostResource> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://api.yactouat.com";
  const postDataAPICall = await fetch(`${baseUrl}/blog-posts/${slug}`);
  const postDataJSON = await postDataAPICall.json();
  const postData = postDataJSON.data;
  return postData;
};

export const getPostsMetadata = async (): Promise<
  {
    date: string;
    slug: string;
    title: string;
  }[]
> => {
  try {
    const postsDataAPICall = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/blog-posts"
        : "https://api.yactouat.com/blog-posts"
    );
    const postsDataJSON = await postsDataAPICall.json();
    const postsData = postsDataJSON.data;
    return postsData.map((post: BlogPostResource) => {
      return {
        date: post.date,
        slug: post.slug,
        title: post.title,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
