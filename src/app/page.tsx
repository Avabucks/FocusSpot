import type { Metadata } from "next";
import Link from "next/link";
import { BiWindowOpen, BiLogoAndroid, BiSolidBolt, BiSolidHeart, BiSolidBulb, BiQuestionMark, BiReceipt, BiBadgeCheck } from "react-icons/bi";
import CheckModerator from "../components/admin/CheckModerator";
import Footer from "../components/navigation/Footer";

export const metadata: Metadata = {
  title: "FocusSpot | Spazi Studio",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. Che tu stia cercando una biblioteca silenziosa per concentrarti sui tuoi esami, un caffè accogliente per lavorare al tuo progetto, o uno spazio di coworking dove incontrare altre persone motivate, FocusSpot ti guida verso il luogo perfetto per te.",
};

export default async function Home() {
  return (
    <>
      <section>
        <div className="flex flex-col gap-5">
          <Link href="/">
            <div className="cta-button primary">
              <BiWindowOpen size={24} />
              <span>Apri FocusSpot</span>
            </div>
          </Link>
          <Link href="/">
            <div className="cta-button primary">
              <BiLogoAndroid size={27} />
              <span>Download .APK (Android)</span>
            </div>
          </Link>
          <div className="divider">Contribuisci</div>
          <Link href="/editor/new">
            <div className="cta-button primary">
              <BiSolidBolt size={24} />
              <span>Aiuta ad aggiungere nuovi spazi studio!</span>
            </div>
          </Link>
          <Link href="https://ko-fi.com/focusspot" target="_blank">
            <div className="cta-button primary">
              <BiSolidHeart size={24} />
              <span>Sostieni il progetto</span>
            </div>
          </Link>
          <Link href="/contact?q=suggerisci">
            <div className="cta-button primary">
              <BiSolidBulb size={24} />
              <span>Proponi una feature per FocusSpot</span>
            </div>
          </Link>
          <div className="divider">Informazioni</div>
          <Link href="/about">
            <div className="cta-button outline">
              <BiQuestionMark size={24} />
              <span>Cos'è FocusSpot?</span>
            </div>
          </Link>
          <Link href="/terms">
            <div className="cta-button outline">
              <BiReceipt size={24} />
              <span>Termini e condizioni</span>
            </div>
          </Link>
          <CheckModerator load={false} closeOnError={false}>
            <div className="divider">Moderation</div>
            <Link href="/moderation">
              <div className="cta-button outline">
                <BiBadgeCheck size={24} />
                <span>Moderation</span>
              </div>
            </Link>
          </CheckModerator>
        </div>
      </section>
      <Footer />
    </>
  );
}