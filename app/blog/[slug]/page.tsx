import { notFound } from "next/navigation";
import { getPostData, getAdjacentPosts } from "@/lib/posts";
import BlogPostClient from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params;
    const post = await getPostData(slug);
    const { previousPost, nextPost } = getAdjacentPosts(slug);

    return (
      <BlogPostClient
        post={post}
        previousPost={previousPost}
        nextPost={nextPost}
      />
    );
  } catch (error) {
    console.error("Error loading post:", error);
    notFound();
  }
}
