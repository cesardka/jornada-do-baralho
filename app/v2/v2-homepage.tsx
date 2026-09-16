"use client";

import { I18nProvider } from "@/app/contexts/I18nContext";
import AboutTheAuthor from "@/app/sections/about-the-author";
import AboutTheJourney from "@/app/sections/about-the-journey";
import Footer from "@/app/sections/footer";
import AboutTheChallengeSection from "./_components/about-the-challenge-section";
import AboutTheDeckSection from "./_components/about-the-deck-section";
import CountdownSection from "./_components/countdown-section";
import ReadTheBlogSection from "./_components/read-the-blog-section";
import SignedCardsCarousel from "./_components/signed-cards-carousel";
import V2Nav from "./_components/v2-nav";

export default function V2Homepage() {
  return (
    <I18nProvider>
      <V2Nav />
      <main className="w-full overflow-x-clip">
        <h1 className="sr-only">Jornada do Baralho</h1>
        <div id="countdown" className="scroll-mt-20">
          <CountdownSection />
        </div>
        <div id="deck" className="scroll-mt-20">
          <AboutTheDeckSection />
        </div>
        <div id="challenge" className="scroll-mt-20">
          <AboutTheChallengeSection />
        </div>
        <div id="signed-cards" className="scroll-mt-20">
          <SignedCardsCarousel />
        </div>
        <div id="journey" className="scroll-mt-20">
          <AboutTheJourney prioritizeImages={false} showDeckHistory={false} />
        </div>
        <div id="blog-section" className="scroll-mt-20">
          <ReadTheBlogSection />
        </div>
        <div id="credits" className="scroll-mt-20">
          <AboutTheAuthor />
        </div>
      </main>
      <Footer />
    </I18nProvider>
  );
}
