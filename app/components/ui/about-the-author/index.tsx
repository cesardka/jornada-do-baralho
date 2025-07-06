import { useRef } from "react";
import { useAnimation } from "../../AnimationContext";
import Credits from "./credits";

export default function AboutTheAuthor() {
  const { animationEnded } = useAnimation();
  const aboutTheAuthorRef = useRef(null);

  // TODO:
  // - Add the author's name
  // - Add a short bio
  // - Add a photo of the author
  // - Add a link to the author's website
  // - Add a link to the author's social media
  // - Add a link to the author's email

  if (!animationEnded) {
    return null;
  }

  return (
    <section
      id="aboutTheAuthor"
      ref={aboutTheAuthorRef}
      className={"segment flex h-full w-screen z-10 bg-blue-500"}
    >
      <Credits />
    </section>
  );
}
