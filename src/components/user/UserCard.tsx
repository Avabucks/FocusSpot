"use client";
import { firebaseLogOut } from "@/src/actions/firebase_actions";
import { useUser } from "@/src/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiLogOutCircle, BiKey, BiSolidBadgeCheck } from "react-icons/bi";
import CheckAdmin from "../admin/CheckAdmin";

export default function UserCard() {
    const router = useRouter()
    const { user, setUser } = useUser();

    const handleLogout = async () => {
        const result = await firebaseLogOut()
        if (result) {
            setUser(null);
            router.push("/")
        }
    };

    if (!user) return null;

    return (
        <div className="flex justify-between items-center w-full p-4 bg-(--contrast-01) rounded-(--border-radius) mt-4">
            <div className="flex gap-2.5 items-center">
                <Image src={user.photoURL} width={40} height={40} alt="foto profilo" className="rounded-full"></Image>
                <p>{user.username}</p>
                {user.isModerator === 1 && (
                    <div className="text-(--primary)">
                        <BiSolidBadgeCheck size={22} />
                    </div>
                )}
                <CheckAdmin load={false} closeOnError={false}>
                    <div className="opacity-50">
                        <BiKey size={22} />
                    </div>
                </CheckAdmin>
            </div>
            <div>
                <button onClick={handleLogout} className="flex items-center cursor-pointer"><BiLogOutCircle size={24} /></button>
            </div>
        </div>
    );
}