import Link from "next/link";
// import { useAnimation } from "../../contexts/AnimationContext";

export default function Footer() {
  // const { animationEnded } = useAnimation();
  const copyrightYear = new Date().getFullYear();

  // if (!animationEnded) return null;

  return (
    <div className="w-full h-14 border-t border-[#718226] bg-[#17360d] p-5 flex items-center justify-center text-[#fff9cf] text-sm z-10">
      <Link
        href="https://www.instagram.com/cesardka"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-1 font-bold underline-offset-4 transition-colors hover:text-[#e7c873] hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff9cf] motion-reduce:transition-none"
      >
        César Hoffmann
      </Link>{" "}
      © {copyrightYear}
      {/* I don't think this copyright symbol means much unless I go after do the paperwork, right? Hopefully not -- */}
    </div>
  );
}
