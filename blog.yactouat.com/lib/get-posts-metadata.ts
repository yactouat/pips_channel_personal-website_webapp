export interface BlogPostMetaData {
  date: string;
  slug: string;
  title: string;
}

export const getPostsMetadata = async (): Promise<BlogPostMetaData[]> => {
  try {
    const blogPostsMetadataAPICall = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/blog-posts"
        : "https://api.yactouat.com/blog-posts"
    );
    const blogPostsMetadataJSON = await blogPostsMetadataAPICall.json();
    const blogPostsMetadata = blogPostsMetadataJSON.data;
    return blogPostsMetadata;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getPostsMetadata;
