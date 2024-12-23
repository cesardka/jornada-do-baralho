import DeckList from "./components/ui/deck-list";

export default function Card() {
  return (
    <div id="container">
      <div id="background-pattern"></div>
      <DeckList />
      <div id="showcase-card-container" />
    </div>
  );
}
