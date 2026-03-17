"use client";
import { firebaseLogIn } from "@/src/actions/firebase_actions";
import { getUser, setUsername } from "@/src/actions/users_actions";
import { useUser } from "@/src/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import Image from "next/image";
import GoogleLogo from "@/public/assets/google_logo.svg"
import { BiCheck, BiErrorAlt } from "react-icons/bi";
import clsx from "clsx";
import { toSeoFriendly } from "@/src/utils/utils";

export default function FormLogin() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [slider, setSlider] = useState(0)
    const [loading, setLoading] = useState(false)
    const [usernameString, setUsernameString] = useState("");
    const [errorMsg, setErrorMsg] = useState<{ success?: boolean; error?: string; }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 15) {
            setUsernameString(toSeoFriendly(e.target.value));
        }
    };

    const handleLogin = async () => {
        setLoading(true)
        const result = await firebaseLogIn()
        if (result) setUser(result)
        setLoading(false)
    }

    const handleSetUsername = () => {
        if (usernameString === "") setErrorMsg({ success: false, error: "Il campo username non può essere vuoto" })
        else setErrorMsg({ success: true, })
    };

    useEffect(() => {
        const updateUsername = async () => {
            setLoading(true)
            if (user && errorMsg.success === true) {
                const result = await setUsername(user.uid || "", usernameString);
                setErrorMsg(result || { success: false, error: "Errore generico" });

                if (result.success) {
                    const userCookie = {
                        uid: user.uid,
                        username: usernameString,
                    };

                    setCookie("user", JSON.stringify(userCookie), { maxAge: 365 * 24 * 60 * 60 });

                    const returnUser = await getUser(usernameString, user.uid)
                    setUser(returnUser)
                }
            }
            setLoading(false)
        };

        updateUsername();
    }, [errorMsg.success]);

    useEffect(() => {
        (user && user.username != user.uid) && router.push("/editor/new");
        (user && user.username === user.uid) && setSlider(1);
    }, [user]);

    const btnClasses = clsx(
        "cta-button",
        (usernameString.length > 0) ? "primary" : "disabled noClick"
    );

    return (
        <>
            {(errorMsg.success === false) && (
                <div className="relative flex items-center gap-2.5 overflow-hidden border-solid border-2 border-red-500 text-red-500 p-5 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-red-500 before:opacity-20">
                    <div><BiErrorAlt className='text-[1.3rem]' /></div>
                    {errorMsg.error}
                </div>
            )}
            <div className="flex flex-col gap-5 flex-1 justify-center">
                {slider === 0 && (
                    <>
                        {loading ?
                            <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                            :
                            <button className="cta-button outline" onClick={handleLogin}>
                                <Image src={GoogleLogo} alt="google_logo" width={20} height={20} />
                                Accedi con Google
                            </button>
                        }
                        <p className="text-center">Ti ringraziamo per il tuo contributo: verrai inserito nella classifica dei <span className="font-semibold">Contributors</span> all'interno dell'app.</p>
                    </>
                )}
                {slider === 1 && (
                    <>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2.5 items-center justify-between">
                                <input
                                    className="input w-full text-[16px]"
                                    type="text"
                                    value={usernameString}
                                    onChange={handleChange}
                                    placeholder="Inserisci username" />
                            </div>
                        </div>
                        {loading ?
                            <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                            :
                            <button className={btnClasses} onClick={handleSetUsername}><BiCheck size={24} />Imposta username</button>
                        }
                    </>
                )}
            </div>
        </>
    );
}