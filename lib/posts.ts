import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remarkVideo, remarkAudio } from "./remark-video";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostData {
  id: string;
  title: string;
  date: string;
  active?: boolean;
  tags: string[];
  banner?: string;
  contentHtml?: string;
}

export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { title: string; date: string; active?: boolean; tags: string[]; banner?: string }),
    };
  });

  return allPostsData.filter((post) => post.active).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkVideo)
    .use(remarkAudio)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { title: string; date: string; active?: boolean; tags: string[]; banner?: string }),
  };
}

export function getAdjacentPosts(currentPostId: string): {
  previousPost: PostData | null;
  nextPost: PostData | null;
} {
  const allPosts = getSortedPostsData();
  const currentIndex = allPosts.findIndex((post) => post.id === currentPostId);

  if (currentIndex === -1) {
    return { previousPost: null, nextPost: null };
  }

  // Previous post is the one before in the sorted array (more recent)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Next post is the one after in the sorted array (older)
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return { previousPost, nextPost };
}
