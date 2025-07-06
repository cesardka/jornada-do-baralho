import Link from "next/link";
import { useAnimation } from "../../AnimationContext";

export default function Footer() {
  const { animationEnded } = useAnimation();
  const copyrightYear = new Date().getFullYear();

  if (!animationEnded) return;

  return (
    <div className="w-full h-14 p-5 flex items-center justify-center text-white text-sm bg-blue-600 z-10">
      <Link
        href="https://www.instagram.com/cesardka"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-1 font-bold"
      >
        César Hoffmann
      </Link>{" "}
      © {copyrightYear}
      {/* I don't think this copyright symbol means much unless I go after do the paperwork, right? Hopefully not -- */}
    </div>
  );
}
