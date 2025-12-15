"use client";
import { aggiungiLuogo, deleteLuogo, getPlaceFromId } from "@/src/actions/places_actions";
import { useUser } from "@/src/context/UserContext";
import { handleConfetti } from "@/src/utils/confetti";
import { generateMapHTML } from "@/src/utils/map";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiCheck, BiErrorAlt, BiWorld, BiSend, BiSolidBolt, BiSearch, BiRightArrowAlt, BiMapAlt, BiEditAlt, BiTime, BiHome, BiInfoCircle, BiTrash, BiShow, BiHide } from "react-icons/bi";

interface Props {
    id: string;
}

export default function ProfiloLayout({ id }: Readonly<Props>) {
    const router = useRouter();
    const pathname = usePathname().split("/").findLast(Boolean);
    const { user } = useUser();

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [count, setCount] = useState(0)
    const [errorMsg, setErrorMsg] = useState<{ success?: boolean; error?: string; }>({ success: true });
    const [searchString, setSearchString] = useState("")
    const [loading, setLoading] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [nameLoading, setNameLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [formData, setFormData] = useState({
        placeName: "",
        description: "",
        placeLat: null,
        placeLong: null,
        entryMode: 0,
        hasFreeWifi: false,
        hasPowerSockets: false,
        hasAir: false,
        hasHeating: false,
        hasSmart: false,
        hasSilence: false,
    });
    const [openingHours, setOpeningHours] = useState([
        { dayOfWeek: 0, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "21:00" },
        { dayOfWeek: 6, isOpen: true, openTime: "09:00", closeTime: "21:00" },
    ]);
    const entryModes = [
        { value: 0, label: "Accesso libero" },
        { value: 1, label: "Serve la tessera" },
        { value: 2, label: "Consumazione obbligatoria" },
    ];

    const [position, setPosition] = useState({
        lat: null,
        lng: null,
    });

    useEffect(() => {
        if (!user || user.username === user.uid) {
            router.push("/login");
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setNameLoading(true)
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
                );

                if (!response.ok) {
                    throw new Error("Errore nella ricerca");
                }

                const data = await response.json();
                if (data.length == 0) return;
                setFormData(prev => ({
                    ...prev,
                    placeName: data.name
                }));

            } catch (err) {
                console.error(err);
            } finally {
                setNameLoading(false)
            }
        }

        // if (position.lat && position.lng && formData.placeName == "") fetchData();
    }, [position]);

    useEffect(() => {
        setShowMap(id === "new")

        const handleMessage = (event: MessageEvent) => {
            reciveMessage(event.data);
        };

        const handleLoad = () => {
            window.addEventListener('message', handleMessage);
        };

        async function loadPlaceFromId() {
            if (pathname != "new") {
                const result = await getPlaceFromId(pathname || "");
                if (user && result) {
                    setFormData(result.formData)
                    setOpeningHours(result.openingHours)
                    setPosition({ "lat": result.formData.placeLat, "lng": result.formData.placeLong })
                } else {
                    router.push("/")
                }
            }
        }

        const iframe = iframeRef.current;
        if (!iframe) return;

        if (iframe.contentWindow?.document.readyState === 'complete') {
            handleLoad();
            loadPlaceFromId()
        } else {
            iframe.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('message', handleMessage);
            iframe.removeEventListener('load', handleLoad);
        };
    }, []);

    const reciveMessage = (message: any) => {
        const handler = JSON.parse(message);
        if (handler.position) {
            setFormData(prev => ({
                ...prev,
                placeLat: handler.position.lat,
                placeLong: handler.position.lng
            }));
        }
    }

    if (!user) return null;

    const handleSearch = async () => {
        if (!searchString) return;
        setPosition({ "lat": null, "lng": null })
        setLoading(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    searchString
                )}&format=json`
            );

            if (!response.ok) {
                throw new Error("Errore nella ricerca");
            }

            const data = await response.json();
            if (data.length == 0) return;
            const pos = data[0];

            setPosition({ "lat": pos.lat, "lng": pos.lon })
            setFormData(prev => ({
                ...prev,
                "placeLat": pos.lat,
                "placeLong": pos.lon,
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type } = e.target;

        let value: string | boolean;

        if (name === "placeName" && e.target.value.length > 30) return;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            value = e.target.checked;
        } else if (type === "radio" && e.target instanceof HTMLInputElement) {
            value = e.target.value;
        } else {
            value = e.target.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = Number(e.target.dataset.index);
        const name = e.target.name;
        const value = e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;

        setOpeningHours(prev =>
            prev.map((day, i) =>
                i === index ? { ...day, [name]: value } : day
            )
        );
    };

    const handleSend = async () => {
        if (!user) {
            setErrorMsg({ success: false, error: "Utente non caricato" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!formData.placeLat || !formData.placeLong) {
            setErrorMsg({ success: false, error: "Devi impostare una posizione per il luogo" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.placeName == "" || formData.description == "") {
            setErrorMsg({ success: false, error: "Il nome del luogo e la descrizione non possono essere vuoti" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        const result = await aggiungiLuogo(id, user, formData, openingHours)
        if (result.success && user.isAdmin == 0) {
            setProgress(4)
        } else if (result.success && user.isAdmin == 1) {
            router.push('/moderation')
        } else {
            setErrorMsg(result)
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        if (count < 3) {
            setCount(x => x + 1)
            return;
        }
        const result = await deleteLuogo(id)
        if (result) {
            router.push("/moderation")
        }
    }

    const renderMapForm = () => {
        const btnClasses = clsx(
            "cta-button",
            (formData.placeLat && formData.placeLong) ? "primary" : "disabled noClick"
        );

        const mapHTML = generateMapHTML(position)

        return (
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 items-center justify-between">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="w-full font-medium">Posizione del luogo</h3>
                        <div className="flex gap-2.5">
                            <input
                                className="input w-full text-[16px]"
                                type="text"
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                                placeholder="Cerca il luogo sulla mappa" />
                            <div className="aspect-square flex items-center">
                                {loading ?
                                    <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                                    :
                                    <button className="cta-button outline aspect-square" onClick={handleSearch}><BiSearch size={20} /></button>
                                }
                            </div>
                            <div className="aspect-square flex items-center">
                                <button className="cta-button outline aspect-square" onClick={() => setShowMap(prev => !prev)}>
                                    {showMap ?
                                        <BiHide size={20} />
                                        :
                                        <BiShow size={20} />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className={`relative h-[400px] rounded-(--border-radius) overflow-hidden ${showMap ? "" : "hidden"}`}>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="relative w-10 h-10 flex flex-col items-center z-9" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}>
                                    <div className="w-10 aspect-square text-lg border-[3px] border-white rounded-full flex items-center justify-center bg-(--primary-light) text-white">
                                        <div className="ml-0.5 mt-px"><BiSolidBolt size={21} /></div>
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-10 border-t-white -mt-0.5 rounded-lg"></div>
                                </div>
                            </div>
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full select-none"
                                srcDoc={mapHTML}
                                title="map" />
                        </div>
                    </div>
                    <button className={btnClasses} onClick={() => { setProgress(1); setPosition({ "lat": formData.placeLat, "lng": formData.placeLong }) }}><BiCheck size={20} />Avanti</button>
                </div>
            </div>
        )
    }

    const renderEditForm = () => {
        const btnClasses = clsx(
            "cta-button",
            (formData.placeName.length > 0 && formData.description.length > 0) ? "primary" : "disabled noClick"
        );

        return (
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 items-center justify-between">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="w-full font-medium">Informazioni sul luogo</h3>
                        {nameLoading ?
                            <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                            :
                            <input className="input w-full text-[16px]"
                                type="text"
                                name="placeName"
                                value={formData.placeName}
                                onChange={handleChange}
                                placeholder="Nome del luogo" />
                        }
                        <textarea
                            className="textarea w-full text-[16px] h-[300px]"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descrizione del luogo"
                        />
                    </div>
                </div>
                <button className={btnClasses} onClick={() => setProgress(2)}><BiCheck size={20} />Avanti</button>
            </div>
        )
    }

    const renderInfoForm = () => {
        const btnClasses = clsx(
            "cta-button",
            (formData.placeName.length > 0 && formData.description.length > 0) ? "primary" : "disabled noClick"
        );

        return (
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 items-center justify-between">
                    <div className="w-full flex flex-col">
                        <h3 className="w-full font-medium">Tipologia di ingresso</h3>
                        <div className="radio-cont mt-2">
                            {entryModes.map((l) => (
                                <label key={l.value}>
                                    <input
                                        type="radio"
                                        name="entryMode"
                                        value={l.value}
                                        checked={formData.entryMode == l.value}
                                        onChange={handleChange}
                                    />
                                    <span className="check"></span>
                                    <span>{l.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <h3 className="w-full font-medium">Servizi</h3>
                        <div className="switch">
                            <div>
                                <span>
                                    Free WiFi
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasFreeWifi"
                                        name="hasFreeWifi"
                                        checked={formData.hasFreeWifi}
                                        onChange={handleChange} />
                                    <label htmlFor="hasFreeWifi">{''}</label>
                                </div>
                            </div>
                        </div>
                        <div className="switch">
                            <div>
                                <span>
                                    Prese della corrente
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasPowerSockets"
                                        name="hasPowerSockets"
                                        checked={formData.hasPowerSockets}
                                        onChange={handleChange} />
                                    <label htmlFor="hasPowerSockets">{''}</label>
                                </div>
                            </div>
                        </div>
                        <div className="switch">
                            <div>
                                <span>
                                    Aria condizionata
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasAir"
                                        name="hasAir"
                                        checked={formData.hasAir}
                                        onChange={handleChange} />
                                    <label htmlFor="hasAir">{''}</label>
                                </div>
                            </div>
                        </div>
                        <div className="switch">
                            <div>
                                <span>
                                    Riscaldamento
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasHeating"
                                        name="hasHeating"
                                        checked={formData.hasHeating}
                                        onChange={handleChange} />
                                    <label htmlFor="hasHeating">{''}</label>
                                </div>
                            </div>
                        </div>
                        <div className="switch">
                            <div>
                                <span>
                                    Smart Woking
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasSmart"
                                        name="hasSmart"
                                        checked={formData.hasSmart}
                                        onChange={handleChange} />
                                    <label htmlFor="hasSmart">{''}</label>
                                </div>
                            </div>
                        </div>
                        <div className="switch">
                            <div>
                                <span>
                                    Luogo silenzioso
                                </span>
                                <div>
                                    <input type="checkbox"
                                        id="hasSilence"
                                        name="hasSilence"
                                        checked={formData.hasSilence}
                                        onChange={handleChange} />
                                    <label htmlFor="hasSilence">{''}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className={btnClasses} onClick={() => setProgress(3)}><BiCheck size={20} />Avanti</button>
            </div>
        )
    }

    const renderOrarioForm = () => {
        const btnText = () => {
            if (user.isAdmin == 0) {
                return (
                    <><BiSend size={20} />Invia e attendi la revisione!</>
                )
            } else {
                return (
                    <><BiWorld size={20} />Pubblica</>
                )
            }
        }
        const btnClasses = clsx(
            "cta-button",
            count > 2 ? "primary" : "disabled"
        );

        return (
            <div className="flex flex-col gap-5">
                {(errorMsg.success === false) && (
                    <div className="relative flex items-center gap-2.5 overflow-hidden border-solid border-2 border-red-500 text-red-500 p-5 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-red-500 before:opacity-20">
                        <div><BiErrorAlt className='text-[1.3rem]' /></div>
                        {errorMsg.error}
                    </div>
                )}
                <div className="flex flex-col gap-5 items-center justify-between">
                    <div className="w-full flex flex-col">
                        <h3 className="w-full font-medium">Imposta gli orario di apertura</h3>
                        {openingHours.map((giorno, index) => (
                            <div key={index}>
                                <div className="switch">
                                    <div>
                                        <span>{["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"][index]}</span>
                                        <div className="flex items-center gap-2">
                                            {giorno.isOpen ?
                                                <div className="relative overflow-hidden text-green-700 py-1 px-3 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-green-700 before:opacity-20">Aperto</div>
                                                :
                                                <div className="relative overflow-hidden text-red-500 py-1 px-3 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-red-500 before:opacity-20">Chiuso</div>
                                            }
                                            <input
                                                type="checkbox"
                                                id={`day-${index}`}
                                                name="isOpen"
                                                data-index={index}
                                                checked={giorno.isOpen}
                                                onChange={handleChangeHour}
                                            />
                                            <label htmlFor={`day-${index}`}>{''}</label>
                                        </div>
                                    </div>
                                    {giorno.isOpen &&
                                        <div className="-mt-2">
                                            <div className="w-full flex items-center justify-between gap-4 py-2">
                                                <input
                                                    className="input text-[16px]"
                                                    type="time"
                                                    name="openTime"
                                                    data-index={index}
                                                    value={giorno.openTime ?? ""}
                                                    onChange={handleChangeHour}
                                                    placeholder="Orario di apertura"
                                                />
                                                <div className="opacity-50">
                                                    <BiRightArrowAlt size={24} />
                                                </div>
                                                <input
                                                    className="input text-[16px]"
                                                    type="time"
                                                    name="closeTime"
                                                    data-index={index}
                                                    value={giorno.closeTime ?? ""}
                                                    onChange={handleChangeHour}
                                                    placeholder="Orario di chiusura"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    {loading ?
                        <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                        :
                        <button className="cta-button primary" onClick={handleSend}>{btnText()}</button>
                    }
                    {(user.isAdmin == 1 && id != "new") && <button className={btnClasses} onClick={handleDelete}><BiTrash size={20} />Elimina</button>}
                </div>
            </div>
        )
    }

    const renderSuccess = () => {
        handleConfetti()
        return (
            <div className="flex flex-1 justify-center">
                <div className="flex flex-col gap-10 justify-center items-center w-[90%]">
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex items-center gap-2.5">
                            <span className="text-[1.6rem]">🎉</span>
                            <p className="font-medium text-[1.2rem]">Grazie per il tuo contributo!</p>
                        </div>
                        <p className="text-center">Lo spazio è stato ricevuto con successo ed è ora in fase di revisione da parte del nostro team.</p>
                    </div>
                    <Link href="/" className="cta-button outline"><div><BiHome size={20} /></div>Torna alla home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 gap-4 mt-4">
            {progress != 4 && (
                <ol className="flex gap-4 justify-between py-3 items-center">
                    <li>
                        <button className="cursor-pointer text-(--primary)" onClick={() => setProgress(0)}>
                            <span className="before:bg-(--primary-light) before:opacity-20 relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full before:content-[''] before:absolute before:inset-0 before:w-full before:h-full">
                                <div>
                                    <BiMapAlt size={20} />
                                </div>
                            </span>
                        </button>
                    </li>
                    <li className={`w-full border-t-4 rounded-full ${progress > 0 ? "border-t-(--primary)" : "border-t-(--contrast-01)"}`}></li>
                    <li>
                        <button className={`${progress > 0 ? "cursor-pointer text-(--primary)" : "pointer-events-none text-(--contrast-02)"}`} onClick={() => setProgress(1)}>
                            <span className={`${progress > 0 ? "before:bg-(--primary-light) before:opacity-20" : "before:bg-(--contrast-005)"} relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full before:content-[''] before:absolute before:inset-0 before:w-full before:h-full`}>
                                <div>
                                    <BiEditAlt size={20} />
                                </div>
                            </span>
                        </button>
                    </li>
                    <li className={`w-full border-t-4 rounded-full ${progress > 1 ? "border-t-(--primary)" : "border-t-(--contrast-01)"}`}></li>
                    <li>
                        <button className={`${progress > 1 ? "cursor-pointer text-(--primary)" : "pointer-events-none text-(--contrast-02)"}`} onClick={() => setProgress(2)}>
                            <span className={`${progress > 1 ? "before:bg-(--primary-light) before:opacity-20" : "before:bg-(--contrast-005)"} relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full before:content-[''] before:absolute before:inset-0 before:w-full before:h-full`}>
                                <div className="ml-px">
                                    <BiInfoCircle size={20} />
                                </div>
                            </span>
                        </button>
                    </li>
                    <li className={`w-full border-t-4 rounded-full ${progress > 2 ? "border-t-(--primary)" : "border-t-(--contrast-01)"}`}></li>
                    <li>
                        <button className={`${progress > 2 ? "cursor-pointer text-(--primary)" : "pointer-events-none text-(--contrast-02)"}`} onClick={() => setProgress(3)}>
                            <span className={`${progress > 2 ? "before:bg-(--primary-light) before:opacity-20" : "before:bg-(--contrast-005)"} relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full before:content-[''] before:absolute before:inset-0 before:w-full before:h-full`}>
                                <div className="ml-px">
                                    <BiTime size={20} />
                                </div>
                            </span>
                        </button>
                    </li>
                </ol>
            )}
            {progress == 0 && renderMapForm()}
            {progress == 1 && renderEditForm()}
            {progress == 2 && renderInfoForm()}
            {progress == 3 && renderOrarioForm()}
            {progress == 4 && renderSuccess()}
        </div>

    );
}