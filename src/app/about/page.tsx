import Footer from "@/src/components/navigation/Footer";
import Navbar from "@/src/components/navigation/NavBar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cos'è FocusSpot? - FocusSpot",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.",
};

export default async function About({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ hide?: string | string[] }>
}>) {
  const { hide } = await searchParams
  const showHeaderFooter = !hide || hide === "no";

  return (
    <>
      {showHeaderFooter && <Navbar />}
      <section>
        {showHeaderFooter && (
          <div className="my-5">
            <h2 className="font-bold text-[2.6rem] leading-10">Cos'è FocusSpot?</h2>
          </div>
        )}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <p>
              <span className="font-semibold text-(--primary)">FocusSpot</span> è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città.
            </p>
            <p>
              Con FocusSpot puoi esplorare una varietà di ambienti pensati per la produttività:
            </p>
            <ul className="list-disc ml-10">
              <li>biblioteche pubbliche e universitarie,</li>
              <li>sale studio,</li>
              <li>caffetterie con WiFi,</li>
              <li>parchi con aree attrezzate,</li>
              <li>e molto altro ...</li>
            </ul>
            <p>Ogni luogo è accompagnato da informazioni dettagliate aggiunte dalla <span className="font-semibold">community</span> e indicazioni utili per aiutarti a scegliere lo spazio ideale per le tue esigenze.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">
              Perché FocusSpot?
            </h3>
            <p>
              Perché crediamo che l'ambiente giusto faccia la differenza. Studiare o lavorare in uno spazio che risponde alle tue necessità può trasformare la tua produttività e rendere più piacevoli le tue giornate di studio o lavoro.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">
              Contribuisci
            </h3>
            <p>
              Puoi contribuire a migliorare FocusSpot in due modi:
            </p>
            <ul className="list-disc ml-10">
              <li>segnalando nuovi spazi di studio o lavoro da aggiungere alle mappe <Link className="text-(--primary-light) underline" href="/editor/new">qui</Link>,</li>
              <li>sostenendo il progetto tramite una donazione su <Link className="text-(--primary-light) underline" href="https://ko-fi.com/focusspot" target="_blank">Ko-fi</Link>.</li>
            </ul>
            <p>Il tuo contributo aiuta la community a crescere e a mantenere aggiornate le informazioni sui luoghi disponibili.</p>
          </div>
        </div>
      </section>
      {showHeaderFooter && <Footer />}
    </>
  );
}