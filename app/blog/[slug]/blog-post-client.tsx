"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { PostData } from "@/lib/posts";
import { useI18n } from "@/app/contexts/I18nContext";

interface BlogPostClientProps {
  post: PostData;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { t } = useI18n();

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back to blog button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          {t("blog.backToBlog")}
        </Link>
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
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
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
        <div className="flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            {t("blog.allPosts")}
          </Link>

          <div className="text-sm text-gray-500">{t("blog.sharePost")}</div>
        </div>
      </footer>
    </article>
  );
}
