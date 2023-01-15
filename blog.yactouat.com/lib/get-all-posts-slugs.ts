import { getPostsMetadata } from "./get-posts-data";

export const getAllPostsSlugs = async () => {
  const postsMetadata = await getPostsMetadata();
  return postsMetadata.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
};

export default getAllPostsSlugs;
