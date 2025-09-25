export const RSSButton = () => {
  return (
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
  );
};
