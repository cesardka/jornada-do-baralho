export default function Footer() {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="w-full h-20 p-10 flex items-center justify-center text-white text-xl bg-blue-600 z-10">
      © {copyrightYear}
    </div>
  );
}
