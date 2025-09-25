import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/posts";
import BlogClient from "./blog-client";

// Loading component for the Suspense fallback
function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-md">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogClient allPosts={allPosts} />
    </Suspense>
  );
}
