import Image from "next/image";

export default function FallingCards() {
  const cardImages = [
    "nerdcast-k-alottoni.webp",
    "nerdcast-q-francine.webp",
    "nerdcast-k-srk.webp",
    "nerdcast-j-gugaferrari.webp",
    "nerdcast-k-jp.webp",
    "nerdcast-a-briggs.webp",
    "nerdcast-a-nickellis.webp",
    "nerdcast-k-azaghal.webp",
    "nerdcast-joker-fabioyabu.webp",
    "nerdcast-q-srajovemnerd.webp",
    "nerdcast-q-portuguesa.webp",
    "nerdcast-a-carlosvoltor.webp",
    "nerdcast-j-tucano.webp",
    "nerdcast-q-ruiva.webp",
    "nerdcast-j-bluehand.webp",
    "nerdcast-amigoimaginario.webp",
    "nerdcast-j-eduardospohr.webp",
    "nerdcast-a-android.webp",
    "nerdcast-joker-tresde.webp",
  ];

  const cards = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    image: cardImages[i % cardImages.length],
  }));

  return (
    <>
      <style jsx>{`
        @keyframes fallAndSpin3D {
          0% {
            transform: translateY(-100vh) translateX(0px) rotateX(0deg)
              rotateY(0deg) rotateZ(0deg);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-50vh) translateX(var(--random-x-25))
              rotateX(90deg) rotateY(180deg) rotateZ(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(0vh) translateX(var(--random-x-50))
              rotateX(180deg) rotateY(360deg) rotateZ(180deg);
            opacity: 0.5;
          }
          75% {
            transform: translateY(50vh) translateX(var(--random-x-75))
              rotateX(270deg) rotateY(540deg) rotateZ(270deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh) translateX(var(--random-x-100))
              rotateX(360deg) rotateY(720deg) rotateZ(360deg);
            opacity: 0;
          }
        }
        .falling-card {
          position: absolute;
          width: 50px;
          height: 70px;
          pointer-events: none;
          z-index: 0;
          perspective: 1000px;
          opacity: 0;
          animation: fallAndSpin3D var(--fall-duration) linear infinite
            var(--animation-delay);
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: cardFlip var(--flip-duration) linear infinite
            var(--flip-delay);
          animation-direction: var(--flip-direction);
        }
        @keyframes cardFlip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        @keyframes cardFlipReverse {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-180deg);
          }
          100% {
            transform: rotateY(-360deg);
          }
        }
        @keyframes cardFlipSlow {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(45deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(0deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(-45deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }
        @keyframes cardFlipFast {
          0% {
            transform: rotateY(0deg) rotateZ(0deg);
          }
          33% {
            transform: rotateY(120deg) rotateZ(60deg);
          }
          66% {
            transform: rotateY(240deg) rotateZ(120deg);
          }
          100% {
            transform: rotateY(360deg) rotateZ(180deg);
          }
        }
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .card-back {
          transform: rotateY(180deg);
        }
        ${cards
          .map((card, index) => {
            // Use modulo to cycle through arrays for 90 cards
            const positions = [
              5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 30, 50, 70, 90, 8, 18,
              28, 38, 48, 58, 68, 78, 88, 12, 22, 32, 42, 52, 62, 72, 82, 92, 6,
              16, 26, 36, 46, 56, 66, 76, 86, 96, 4, 14,
            ];
            const delays = [
              0, 0.3, 0.6, 0.9, 1.2, 0.1, 0.4, 0.7, 1.0, 1.3, 1.6, 0.2, 0.5,
              0.8, 1.1, 1.4, 1.7, 2.0, 0.15, 0.45, 0.75, 1.05, 1.35, 1.65, 1.95,
              0.25, 0.55, 0.85, 1.15, 1.45, 1.75, 0.35, 0.65, 0.95, 1.25, 1.55,
              1.85, 0.05, 0.5, 1.0, 1.5, 2.0, 0.2, 0.8, 1.8,
            ];
            const durations = [
              7, 9, 8, 10, 7.5, 8.5, 9.5, 7.8, 8.2, 9.2, 8.8, 7.3, 9.8, 8.3,
              7.7, 8.9, 7.4, 9.1, 8.6, 7.9, 8.4, 9.3, 7.6, 8.7, 9.4, 8.1, 7.8,
              9.6, 8.3, 7.5, 9.7, 8.8, 7.2, 9.5, 8.2, 7.1, 9.8, 8.5, 7.3, 9.9,
              8.0, 7.7, 9.2, 8.6, 7.4,
            ];
            const randomX = [
              [-20, 15, -10, 25],
              [30, -15, 20, -25],
              [-25, 10, -30, 15],
              [20, -20, 25, -10],
              [-15, 25, -20, 30],
              [35, -25, 15, -30],
              [-30, 20, -15, 25],
              [25, -30, 20, -15],
              [-20, 30, -25, 10],
              [15, -35, 30, -20],
              [-25, 15, -30, 20],
              [30, -20, 25, -15],
              [-15, 25, -20, 35],
              [20, -25, 15, -30],
              [-30, 20, -25, 15],
              [25, -18, 30, -12],
              [-22, 28, -15, 20],
              [32, -25, 18, -28],
              [-28, 22, -32, 25],
              [20, -30, 25, -18],
              [-25, 35, -20, 30],
              [30, -22, 28, -25],
              [-30, 25, -18, 22],
              [22, -28, 32, -20],
              [-35, 18, -25, 28],
              [28, -32, 20, -25],
              [-20, 30, -28, 35],
              [25, -18, 30, -22],
              [-32, 25, -20, 28],
              [18, -25, 35, -30],
              [-25, 32, -18, 25],
              [30, -20, 25, -35],
              [-28, 22, -30, 18],
              [35, -28, 22, -25],
              [-22, 30, -35, 20],
              [25, -32, 28, -18],
              [-30, 20, -25, 32],
              [22, -28, 35, -20],
              [-35, 25, -22, 30],
              [28, -25, 20, -32],
              [-20, 35, -30, 25],
              [32, -22, 28, -35],
              [-25, 18, -32, 22],
              [30, -35, 25, -18],
              [-28, 22, -20, 35],
            ];

            // Random flip patterns
            const flipAnimations = [
              "cardFlip",
              "cardFlipReverse",
              "cardFlipSlow",
              "cardFlipFast",
            ];
            const flipDurations = [2.5, 3, 3.5, 4, 4.5, 2, 5];
            const flipDelays = [0, 0.2, 0.5, 0.8, 1, 1.3, 1.6];
            const flipDirections = [
              "normal",
              "reverse",
              "alternate",
              "alternate-reverse",
            ];

            const flipAnimation = flipAnimations[index % flipAnimations.length];
            const flipDuration = flipDurations[index % flipDurations.length];
            const flipDelay = flipDelays[index % flipDelays.length];
            const flipDirection = flipDirections[index % flipDirections.length];

            return `.falling-card:nth-child(${index + 1}) { 
            left: ${positions[index % positions.length]}%; 
            --animation-delay: ${delays[index % delays.length]}s;
            --fall-duration: ${durations[index % durations.length]}s;
            --random-x-25: ${randomX[index % randomX.length][0]}px;
            --random-x-50: ${randomX[index % randomX.length][1]}px;
            --random-x-75: ${randomX[index % randomX.length][2]}px;
            --random-x-100: ${randomX[index % randomX.length][3]}px;
          }
          .falling-card:nth-child(${index + 1}) .card-inner {
            animation-name: ${flipAnimation};
            --flip-duration: ${flipDuration}s;
            --flip-delay: ${flipDelay}s;
            --flip-direction: ${flipDirection};
          }`;
          })
          .join("\n        ")}
      `}</style>

      {cards.map((card) => (
        <div key={card.id} className="falling-card">
          <div className="card-inner">
            <div className="card-front">
              <Image
                src={`/images/card/${card.image}`}
                alt={`Falling card ${card.id}`}
                width={50}
                height={70}
                className="w-full h-full object-cover rounded-md"
                unoptimized
              />
            </div>
            <div className="card-back">
              <Image
                src="/images/card/card-back-red.webp"
                alt="Card back"
                width={50}
                height={70}
                className="w-full h-full object-cover rounded-md"
                unoptimized
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
