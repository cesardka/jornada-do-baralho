import type { Metadata } from "next";
import V2Homepage from "./v2/v2-homepage";

export const metadata: Metadata = {
  title: "Jornada do Baralho",
  description: "Uma nova experiência para acompanhar a Jornada do Baralho",
};

export default function Homepage() {
  return <V2Homepage />;
}
