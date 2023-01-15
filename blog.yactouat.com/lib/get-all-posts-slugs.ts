import getPostsMetadata from "./get-posts-metadata";

// used in ./pages/posts/[slug].tsx
export const getAllPostsSlugs = async () => {
  const postsSlugs = (await getPostsMetadata()).map((post) => {
    params: {
      slug: post.slug;
    }
  });
};

export default getAllPostsSlugs;
