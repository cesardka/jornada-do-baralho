import Image from "next/image";

export default function ProgressBar() {
  return (
    <div
      id="progress-bar"
      className={`sticky bottom-5 h-20 min-w-full z-10 slide-in container lg`}
      style={{
        margin: "0 auto",
      }}
    >
      <div
        className="flex items-center justify-between h-full w-2/5 px-5 text-3xl font-bold container md"
        style={{ margin: "0 auto" }}
      >
        <div
          id="deckbox-container"
          className="h-20 w-20 flex items-center justify-center bg-orange-400"
        >
          <Image
            id="deckbox"
            src="/images/deckbox-placeholder.png"
            alt="Deckbox placeholder, card container"
            className="w-auto opacity-0"
            priority
            width={80}
            height={80}
          />
        </div>
        <div
          id="deck-progress"
          className="h-20 w-full flex-1 bg-green-400 pt-1 pb-1"
        >
          <Image
            src="/images/ipad-1.png"
            alt="Stock image of an iPad 1 model from 2010"
            className="justify-self-end h-full w-auto"
            width={80}
            height={80}
          />
        </div>
      </div>
    </div>
  );
}
