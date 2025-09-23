"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PostData } from "@/lib/posts";
import { useI18n } from "@/app/contexts/I18nContext";

interface BlogClientProps {
  allPosts: PostData[];
}

export default function BlogClient({ allPosts }: BlogClientProps) {
  const { t } = useI18n();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [allPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedTag) {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    }

    posts.sort((a, b) => {
      if (sortOrder === "newest") {
        return a.date < b.date ? 1 : -1;
      } else {
        return a.date > b.date ? 1 : -1;
      }
    });

    return posts;
  }, [allPosts, sortOrder, selectedTag]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">{t("blog.title")}</h1>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
          title="Subscribe to RSS Feed"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.429 2.571c8.571 0 15.429 6.857 15.429 15.429h-3.714c0-6.857-5.714-12.571-12.571-12.571v-2.857zM3.429 7.714c5.143 0 9.714 4.571 9.714 9.714h-3.714c0-3.429-2.571-6-6-6v-3.714zM6.857 14.857c0 1.143-0.857 2-2 2s-2-0.857-2-2 0.857-2 2-2 2 0.857 2 2z"></path>
          </svg>
          RSS Feed
        </a>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{t("blog.sortBy")}:</span>
          <button
            onClick={() => setSortOrder("newest")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortOrder === "newest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("blog.newest")}
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortOrder === "oldest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("blog.oldest")}
          </button>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{t("blog.filterByTag")}:</span>
          <select
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="border rounded-md px-2 py-1 bg-white"
            value={selectedTag || ""}
          >
            <option value="">{t("blog.allTags")}</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("blog.noPosts")}</p>
          </div>
        ) : (
          filteredAndSortedPosts.map(({ id, date, title, tags }) => (
            <article
              key={id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <header className="mb-2">
                <h2 className="text-2xl font-bold">
                  <Link
                    href={`/blog/${id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {title}
                  </Link>
                </h2>
                <small className="text-gray-500">
                  {new Date(date).toLocaleDateString(
                    t("blog.locale") === "pt" ? "pt-BR" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </small>
              </header>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
