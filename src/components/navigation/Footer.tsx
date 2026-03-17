import Link from "next/link";
import { BiCopyright } from "react-icons/bi";

export default function Footer() {
    return (
        <Link href="/terms">
            <div className="flex items-center justify-center gap-1 py-7 opacity-70">FocusSpot<div><BiCopyright size={15} /></div></div>
        </Link>
    )
}