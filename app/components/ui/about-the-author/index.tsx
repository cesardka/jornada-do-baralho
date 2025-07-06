import { useRef } from "react";
import { useAnimation } from "../../AnimationContext";
import Credits from "./credits";

export default function AboutTheAuthor() {
  const { animationEnded } = useAnimation();
  const aboutTheAuthorRef = useRef(null);

  // TODO:
  // -[x] Add the author's name
  // -[x] Add a short bio
  // -[x] Add a photo of the author
  // -[x] Add a link to the author's website
  // -[x] Add a link to the author's social media
  // -[ ] Add a link to the author's email (not sure if will add this one)

  if (!animationEnded) {
    return null;
  }

  return (
    <section
      id="aboutTheAuthor"
      ref={aboutTheAuthorRef}
      className={
        "segment flex h-full w-screen z-10 bg-blue-500 bg-[url('/images/bg/pattern-randomized2.svg')] bg-cover bg-no-repeat bg-top"
      }
    >
      <Credits />
    </section>
  );
}
