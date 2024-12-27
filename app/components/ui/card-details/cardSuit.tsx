const CardSuit = ({
  suit,
  value,
}: {
  suit: "" | "♠" | "♣" | "♥" | "♦";
  value: "K" | "Q" | "J" | "A" | "Joker" | "Bônus";
}) => {
  const isRed = suit === "♦" || suit === "♥";
  const textColor = isRed ? "text-red-600" : "text-black";

  return (
    <div className={`flex items-center justify-center gap-2 ${textColor}`}>
      {/* <span className="inline-block w-2 h-2 mx-2 bg-gray-800 rounded-full"></span> */}
      <span className="text-5xl mb-1">{suit}</span>
      <span className="text-4xl font-thin font-serif">{value}</span>
    </div>
  );
};

export default CardSuit;
