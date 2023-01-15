export interface PostMetaData {
  contents: string;
  date: string;
  slug: string;
  title: string;
}

export interface PostData extends PostMetaData {}

export const getPostData = async (slug: string): Promise<PostData> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://api.yactouat.com";
  const postDataAPICall = await fetch(`${baseUrl}/blog-posts/${slug}`);
  const postDataJSON = await postDataAPICall.json();
  const postData = postDataJSON.data;
  return postData;
};

export const getPostsMetadata = async (): Promise<PostMetaData[]> => {
  try {
    const postsMetadataAPICall = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/blog-posts"
        : "https://api.yactouat.com/blog-posts"
    );
    const postsMetadataJSON = await postsMetadataAPICall.json();
    const postsMetadata = postsMetadataJSON.data;
    return postsMetadata;
  } catch (error) {
    console.error(error);
    return [];
  }
};
