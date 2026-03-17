"use client";

import ListAdmin from "@/src/components/admin/ListAdmin";
import { useState } from "react";

export default function Admin() {
    const [searchString, setSearchString] = useState("");

    return (
        <div className="flex flex-col gap-5 mt-4">
            <input
                className="input w-full text-[16px]"
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="Cerca luogo" />
            <div className="flex flex-col gap-2">
                <h3 className="w-full font-medium">Luoghi da revisionare</h3>
                <ListAdmin type="rev" searchString={searchString} />
            </div>
            <div className="w-full border-t border-t-(--contrast-01)"></div>
            <div className="flex flex-col gap-2">
                <h3 className="w-full font-medium">Luoghi aggiunti</h3>
                <ListAdmin type="acc" searchString={searchString} />
            </div>
        </div>
    );
}