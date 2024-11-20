import Image from "next/image";

export default function ProgressBar() {
  return (
    <div
      id="progress-bar"
      className={`sticky bottom-5 h-20 min-w-full z-10 slide-in container lg shadow`}
      style={{
        margin: "0 auto",
      }}
    >
      <div
        className="flex items-center justify-between h-full w-4/6 px-5 text-3xl font-bold container md"
        style={{ margin: "0 auto" }}
      >
        <div id="deckbox-container" className="h-20 w-20 bg-orange-400"></div>
        <div
          id="deck-progress"
          className="h-20 w-full flex-1 bg-green-400 pt-1 pb-1"
        >
          <Image
            src="/images/ipad-1.png"
            alt="Uno card Front"
            className="justify-self-end h-full"
            width={50}
            height={67}
          />
        </div>
      </div>
    </div>
  );
}
