import { getSortedPostsData, getPostData } from "@/lib/posts";

export async function GET() {
  const posts = getSortedPostsData();

  // Get full content for the latest 10 posts
  const postsWithContent = await Promise.all(
    posts.slice(0, 10).map(async (post) => {
      const fullPost = await getPostData(post.id);
      return fullPost;
    })
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jornada-do-baralho.com.br";
  const feedUrl = `${siteUrl}/feed`;
  const blogUrl = `${siteUrl}/blog`;

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jornada do Baralho - Blog</title>
    <description>Acompanhe a jornada épica através do universo Jovem Nerd com reflexões, atualizações e descobertas pelo caminho.</description>
    <link>${blogUrl}</link>
    <language>pt-BR</language>
    <managingEditor>cesardka@gmail.com (Cesar DKA)</managingEditor>
    <webMaster>cesardka@gmail.com (Cesar DKA)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/jornada-do-baralho.png</url>
      <title>Jornada do Baralho</title>
      <link>${blogUrl}</link>
    </image>
    ${postsWithContent
      .map((post) => {
        const postUrl = `${siteUrl}/blog/${post.id}`;
        const pubDate = new Date(post.date).toUTCString();

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.contentHtml}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.tags.join(", ")}]]></category>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
