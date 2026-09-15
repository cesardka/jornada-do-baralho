import type { Metadata } from "next";
import V2Homepage from "./v2-homepage";

export const metadata: Metadata = {
  title: "Jornada do Baralho — V2",
  description: "Uma nova experiência para acompanhar a Jornada do Baralho",
};

export default function V2Page() {
  return <V2Homepage />;
}
