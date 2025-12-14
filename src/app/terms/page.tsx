import Footer from "@/src/components/navigation/Footer";
import Navbar from "@/src/components/navigation/NavBar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini e condizioni - FocusSpot",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.",
};

export default async function Terms({
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
          <div className="mt-[15px] mb-5">
            <h2 className="font-bold text-[2.6rem] leading-[2.7rem]">Termini e condizioni</h2>
            <p className="mt-2.5 opacity-50 text-[.9rem]">Aggiornati a Gennaio 2026</p>
          </div>
        )}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <p>Benvenuto su <span className="font-semibold text-(--primary)">FocusSpot</span> (da qui in avanti, il “Sito”), una piattaforma dedicata alla ricerca, condivisione e consultazione di mappe interattive delle aule studio e spazi di studio disponibili.
              L'accesso e l'utilizzo del Sito sono offerti dai suoi creatori (da qui in avanti, i “Creatori”) secondo i termini riportati in questa pagina (“Termini”).
            </p>
            <p>Accedendo al Sito, creando un account personale e/o inviando contenuti, l'utente (“Utente” o “Utenti”) dichiara di aver letto e accettato integralmente i presenti Termini. I Creatori si riservano il diritto di modificarli in qualsiasi momento; l'utilizzo continuato del Sito implica l'accettazione automatica delle eventuali modifiche.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Disclaimer</h3>
            <p>Il Sito fornisce mappe e informazioni sulle aule studio e spazi di lavoro. I dati sono raccolti da fonti pubbliche e dagli stessi Utenti. Il Sito ha finalità informative e organizzative, ma non garantisce la disponibilità effettiva o la correttezza costante delle informazioni.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Attribuzione</h3>
            <p>Le mappe e i dati geografici presenti sul Sito sono forniti da OpenStreetMap (OSM) e dai suoi collaboratori, disponibili sotto licenza Open Database License (ODbL).</p>
            <p>Maggiori informazioni <a href="https://www.openstreetmap.org/copyright" target="_blank" className="text-(--primary-light) underline">qui</a>.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Esclusione di responsabilità</h3>
            <p>I Creatori non garantiscono l'assoluta correttezza o aggiornamento dei dati sulle aule studio e non sono responsabili per eventuali errori o modifiche non riportate. L'uso delle informazioni presenti sul Sito è a esclusivo rischio dell'Utente.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Account e Profilo Utente</h3>
            <p>Gli Utenti possono scegliere di creare un account personale (“Profilo”), utilizzando un indirizzo email valido o un account di terze parti (es. Google o Facebook). Il Profilo può includere:</p>
            <ul className="list-disc ml-10">
              <li>un nome pubblico (nickname),</li>
              <li>uno username,</li>
              <li>un'immagine avatar personalizzata.</li>
            </ul>
            <p>Il Profilo consente di aggiungere mappe, segnalare aule disponibili, e visualizzare le proprie attività e contributi. Alcune impostazioni sono private e accessibili solo dall'Utente stesso.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Età minima</h3>
            <p>In ottemperanza alla normativa italiana sul GDPR, la registrazione è vietata ai minori di 14 anni senza consenso dei genitori o di chi ne fa le veci. Registrandosi, l'Utente dichiara di avere almeno 14 anni o di disporre di tale consenso.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Eliminazione dei dati personali</h3>
            <p>L'Utente può richiedere la cancellazione completa dei propri dati personali scrivendo nella pagina dedicata{showHeaderFooter && <span>: <Link className="text-(--primary-light) underline" href="/contact?q=terms">contattaci</Link></span>}.
              La richiesta sarà gestita entro 30 giorni.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Condotta dell'Utente</h3>
            <p>Sul Sito non è consentito pubblicare contenuti che siano:</p>
            <ul className="list-disc ml-10">
              <li>diffamatori, illegali, discriminatori o offensivi;</li>
              <li>falsi, fuorvianti o volutamente imprecisi;</li>
              <li>lesivi di diritti di terzi (privacy, proprietà intellettuale, ecc.);</li>
              <li>contrari allo spirito informativo e organizzativo del Sito.</li>
            </ul>
            <p>I Creatori o i Moderatori possono rifiutare, modificare o rimuovere contenuti a loro discrezione, senza che ciò comporti responsabilità verso l'Utente.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Privacy e Cookie</h3>
            <p>Il Sito rispetta la normativa vigente in materia di protezione dei dati personali (GDPR). I dati raccolti sono limitati a email, nickname e dati tecnici di navigazione (IP, browser, sistema operativo, pagine visitate). I dati vengono utilizzati esclusivamente per gestire il Profilo e migliorare l'esperienza di navigazione. FocusSpot utilizza cookie tecnici (necessari al funzionamento) e, previo consenso, cookie analitici e di profilazione pubblicitaria. L'Utente può modificare le preferenze sui cookie in qualsiasi momento tramite il banner o le impostazioni del browser. Gli Utenti hanno diritto di accedere, modificare o cancellare i propri dati, nonché di revocare il consenso al trattamento scrivendo nella pagina dedicata{showHeaderFooter && <span>: <Link className="text-(--primary-light) underline" href="/contact?q=terms">contattaci</Link></span>}.</p>
            <p>I tuoi dati di posizione vengono utilizzati solo per visualizzare la mappa e non vengono condivisi con terze parti.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Licenza e utilizzo dei contenuti</h3>
            <p>I contenuti pubblicati sul Sito, comprese le mappe e segnalazioni di aule, sono disponibili con licenza Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).</p>
            <ul className="list-disc ml-10">
              <li>L'Utente può condividere e riutilizzare i contenuti, anche a scopo educativo o organizzativo;</li>
              <li>Deve sempre citare l'autore e la fonte “FocusSpot”;</li>
              <li>Se modifica o rielabora i contenuti, deve distribuirli sotto la stessa licenza.</li>
            </ul>
            {showHeaderFooter &&
              <p>Ulteriori informazioni sulla licenza CC BY-SA 4.0 sono disponibili <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.it" target="_blank" className="text-(--primary-light) underline">qui</a>.</p>
            }
            <p>Gli Utenti non possono utilizzare il Sito per attività illegali, per accedere a dati riservati né per scopi contrari alla legge.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Copyright e proprietà intellettuale</h3>
            <p>I Creatori sono titolari dei diritti relativi al marchio, loghi, grafica e struttura del Sito. I contenuti originali caricati direttamente dai Creatori restano di loro proprietà. I contenuti inviati dagli Utenti vengono condivisi pubblicamente sotto licenza CC BY-SA 4.0. Pubblicando contenuti, l'Utente dichiara di avere tutti i diritti necessari e concede al Sito una licenza irrevocabile, mondiale e gratuita per l'utilizzo, distribuzione e condivisione degli stessi.</p>
          </div>
          {showHeaderFooter &&
            <div className="flex flex-col gap-2.5">
              <h3 className="font-semibold text-[1.3rem] w-full border-t border-t-(--contrast-01) pt-4">Contatti</h3>
              <p className="flex flex-col gap-2.5">Per qualsiasi domanda o segnalazione puoi scriverci nella pagina dedicata: <Link className="text-(--primary-light) underline" href="/contact?q=terms">Contattaci</Link>
              </p>
            </div>
          }
        </div>
      </section>
      {showHeaderFooter && <Footer />}
    </>
  );
}