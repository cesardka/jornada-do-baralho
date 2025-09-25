"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PostData } from "@/lib/posts";
import { useI18n } from "@/app/contexts/I18nContext";
import { RSSButton } from "@/components/ui/rss-button/rss-button";

interface BlogClientProps {
  allPosts: PostData[];
}

export default function BlogClient({ allPosts }: BlogClientProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Initialize selected tags from URL params on mount
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      // Handle both single tag and comma-separated multiple tags
      const tags = Array.isArray(tagParam) ? tagParam : tagParam.split(",");
      setSelectedTags(tags.filter((tag) => tag.trim() !== ""));
    }
  }, [searchParams]);

  // Update URL when selected tags change
  const updateURL = (tags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tags.length > 0) {
      params.set("tag", tags.join(","));
    } else {
      params.delete("tag");
    }

    const newURL = params.toString() ? `?${params.toString()}` : "/blog";
    router.push(newURL, { scroll: false });
  };

  const filteredAndSortedPosts = useMemo(() => {
    let posts = allPosts;

    // Filter by selected tags (posts must include ANY of the selected tags)
    if (selectedTags.length > 0) {
      posts = posts.filter((post) =>
        selectedTags.some((selectedTag) => post.tags.includes(selectedTag))
      );
    }

    posts.sort((a, b) => {
      if (sortOrder === "newest") {
        return a.date < b.date ? 1 : -1;
      } else {
        return a.date > b.date ? 1 : -1;
      }
    });

    return posts;
  }, [allPosts, sortOrder, selectedTags]);

  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      updateURL(newTags);
    }
  };

  const removeTagFilter = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    updateURL(newTags);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    updateURL([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">
          {t("blog.title")}
        </h1>

        <div className="hidden sm:block">
          <RSSButton />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{t("blog.sortBy")}:</span>
          <button
            onClick={() => setSortOrder("newest")}
            className={`px-3 py-1 rounded-md text-sm duration-300 ${
              sortOrder === "newest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("blog.newest")}
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1 rounded-md text-sm duration-300 ${
              sortOrder === "oldest"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("blog.oldest")}
          </button>
        </div>
      </div>

      {/* Tag Filter Pills */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          selectedTags.length > 0
            ? "max-h-96 opacity-100 mb-6"
            : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`transition-transform duration-300 ease-in-out ${
            selectedTags.length > 0 ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-medium text-gray-700">
                {t("blog.activeFilters")}:
              </span>
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeTagFilter(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold duration-300"
                    aria-label={`Remove ${tag} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline duration-300"
            >
              {t("blog.clearAllFilters")}
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedTags.length > 0
                ? t("blog.noPostsWithTags")
                : t("blog.noPosts")}
            </p>
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 underline duration-300"
              >
                {t("blog.clearFiltersToSeeAll")}
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedPosts.map(({ id, date, title, tags }) => (
            <article
              key={id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
                    onClick={() => addTagFilter(tag)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors duration-300 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
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
