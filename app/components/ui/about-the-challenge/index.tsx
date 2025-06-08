import { useAnimation } from "../../AnimationContext";

export default function AboutTheChallenge() {
  const { animationEnded } = useAnimation();

  // TODO:
  // - Add a description of the challenge
  // - Add a link to the challenge's website
  // - Add a description of what is Jovem Nerd and Azaghal, and their history

  return (
    <section
      id="aboutTheChallenge"
      className={
        "segment flex" +
        (animationEnded && " h-screen w-screen z-10 mt-5 bg-orange-500")
      }
    ></section>
  );
}
