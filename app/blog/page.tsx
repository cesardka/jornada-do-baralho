import { getSortedPostsData } from "@/lib/posts";
import BlogClient from "./blog-client";

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return <BlogClient allPosts={allPosts} />;
}
