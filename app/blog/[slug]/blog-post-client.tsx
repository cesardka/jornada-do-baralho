"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PostData } from "@/lib/posts";
import { useI18n } from "@/app/contexts/I18nContext";

interface BlogPostClientProps {
  post: PostData;
  previousPost: PostData | null;
  nextPost: PostData | null;
}

export default function BlogPostClient({
  post,
  previousPost,
  nextPost,
}: BlogPostClientProps) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure smooth animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <article
      className={`
        max-w-5xl mx-auto sm:pl-14 p-10
        bg-[url('/images/bg/paper-checkered-texture-bg3.webp')] bg-[length:400px] bg-repeat
        shadow-xl
        transition-all duration-700 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-56 opacity-0"}
      `}
    >
      {/* Back to blog button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800  duration-300 transition-colors py-2 px-4 hover:bg-blue-100"
        >
          <ArrowLeft size={20} />
          {t("blog.backToBlog")}
        </Link>
      </div>

      <div className="relative">
        <Image
          src={`/images/bg/paper-clip-2.webp`}
          alt={post.title}
          width={60}
          height={80}
          className="absolute -top-[8rem] w-5 -right-12 sm:right-3"
        />
      </div>

      {/* Post header */}
      <header className="mb-8 pb-8 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(
                t("blog.locale") === "pt" ? "pt-BR" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </time>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-gray-500" />
            {post.tags.map((tag, index) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-blue-800 text-sm shadow-sm transition-all duration-300 bg-cover bg-center hover:brightness-105 hover:shadow-md"
                style={{
                  backgroundImage: `url('/images/bg/washi-tape-texture${
                    index + 1
                  }.webp')`,
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Post content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600 prose-img:rounded-lg prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
      />

      {/* Navigation to other posts */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        {/* Previous/Next Post Navigation */}
        <div className="flex justify-between items-center border-t border-gray-100">
          <div className="flex-1">
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.id}`}
                className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300"
              >
                <ChevronLeft
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                />
                <div className="text-left">
                  <div className="text-sm text-gray-500 mb-1">
                    {t("blog.previousPost")}
                  </div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 overflow-ellipsis">
                    {nextPost.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-4"></div>
            )}
          </div>

          <div className="flex-1">
            {previousPost ? (
              <Link
                href={`/blog/${previousPost.id}`}
                className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300 justify-end text-right"
              >
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {t("blog.nextPost")}
                  </div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 overflow-ellipsis">
                    {previousPost.title}
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                />
              </Link>
            ) : (
              <div className="p-4"></div>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
