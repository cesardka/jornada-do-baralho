import { useAnimation } from "../../AnimationContext";
import Credits from "./credits";

export default function AboutTheAuthor() {
  const { animationEnded } = useAnimation();

  // TODO:
  // - Add the author's name
  // - Add a short bio
  // - Add a photo of the author
  // - Add a link to the author's website
  // - Add a link to the author's social media
  // - Add a link to the author's email
  return (
    <section
      id="aboutTheAuthor"
      className={
        "segment flex" +
        (animationEnded && " h-full w-screen z-10 bg-green-500")
      }
    >
      <Credits />
    </section>
  );
}
