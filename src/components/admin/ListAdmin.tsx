"use client"

import { listAdmin } from "@/src/actions/admin_actions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
    type: string;
    searchString: string;
}

export default function ProfiloLayout({ type, searchString }: Readonly<Props>) {

    const [placesArray, setPlacesArray] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadRewAdmin() {
            const result = await listAdmin(searchString, 0);
            if (result) {
                setPlacesArray(result);
            }
            setIsLoading(false);
        }

        async function loadAcceptedAdmin() {
            const result = await listAdmin(searchString, 2);
            if (result) {
                setPlacesArray(result);
            }
            setIsLoading(false);
        }

        const loaders: { [key: string]: (filterParam?: string) => Promise<void> } = {
            "rev": loadRewAdmin,
            "acc": loadAcceptedAdmin,
        };

        if (loaders[type]) {
            loaders[type]();
        }

    }, [searchString]);

    return (
        <>
            {
                isLoading ?
                    <div className="mx-auto border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                    :
                    <div>
                        {placesArray.length == 0 && <div className="text-center py-5">Nessun luogo da visualizzare</div>}
                        <div className="flex flex-col gap-4">
                            {placesArray.map((place) => (
                                <Link className={`cta-button ${type == "rev" ? "primary" : "outline"}`} key={place.id} href={`/editor/${place.id}`}>
                                    <div className="flex justify-between w-full px-5">
                                        <span>{place.placeName}</span>
                                        {type == "rev" && <span className="opacity-50 text-white">In revisione</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
            }
        </>
    )
}