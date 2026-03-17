"use client";
import Image from "next/image";
import Logo from "@/public/android-chrome-512x512.png";
import Link from "next/link";
import { BiInfoCircle } from "react-icons/bi";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex items-center gap-2.5 px-4 h-[70px] border-b border-b-(--contrast-01)">
        <Link href="/" className="flex items-center gap-3.5">
          <Image className="w-13 aspect-square rounded-(--border-radius)" src={Logo} alt="Logo" width={155} priority />
          <h1 className="text-[1.1rem] font-medium">FocusSpot | Spazi Studio</h1>
        </Link>
      </nav>
      {!pathname.includes("editor") && !pathname.includes("moderation") && (
        <div className="animate-[fade-in_.3s] flex items-center my-4 mx-4 rounded-(--border-radius)">
          <div className="relative w-full flex flex-col gap-2.5 overflow-hidden border-solid border-2 border-(--primary) text-(--primary) p-5 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-(--primary) before:opacity-20">
            <div className="flex gap-2.5 items-center">
              <div><BiInfoCircle size={20} /></div>
              <p>L'app è ancora in beta. Puoi aiutarci a migliorarla contribuendo alla mappa.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}