"use client";

import { getPlaceFromId, mailContact } from "@/src/actions/places_actions";
import { handleConfetti } from "@/src/utils/confetti";
import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiHome, BiSend } from "react-icons/bi";
import dynamic from 'next/dynamic';

const TurnstileCaptcha = dynamic(
  () => import('../captcha/TurnstileCaptcha'),
  { ssr: false }
);

export default function UsersPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const hide = searchParams.get("hide");
  const showHeaderFooter = !hide || hide === "no";
  const type = q === "segnala" || q === "terms" ? q : "suggerisci";
  const id = searchParams.get("id");

  const [success, setSuccess] = useState(false)

  const oggettiByType: Record<string, string[]> = {
    suggerisci: ["Proposta di nuove funzioni/feature", "Miglioramento di funzionalità esistenti", "Altro"],
    segnala: ["Segnalazione di un errore nelle informazioni", "Contenuto obsoleto", "Contenuto inappropriato o falso", "Altro"],
    terms: ["Domande sui Termini di Servizio", "Chiarimenti su Privacy e Regole di Moderazione", "Altro"],
  };

  const bodyPlaceholdersByType: Record<string, string> = {
    suggerisci: "Descrivi la tua proposta per migliorare l'app FocusSpot o suggerire nuove funzionalità.",
    segnala: "Spiega il problema o la segnalazione riguardo lo spazio studio, come errori o informazioni non aggiornate.",
    terms: "Fai una domanda o chiedi chiarimenti riguardo ai Termini di Servizio o alle politiche dell'app.",
  };

  const successTextByType: Record<string, string[]> = {
    suggerisci: ["🙏🏼", "Grazie per il tuo suggerimento!"],
    segnala: ["🙌🏼", "Grazie per la segnalazione."],
    terms: ["👍🏼", "Richiesta inviata."],
  };

  const [formData, setFormData] = useState({
    email: "",
    oggetto: oggettiByType[type][0],
    placeName: null,
    testo: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const btnClasses = clsx(
    "cta-button",
    (formData.email.length > 0 && formData.testo.length > 0 && captchaToken) ? "primary" : "disabled noClick"
  );

  useEffect(() => {
    async function loadPlace() {
      const result = await getPlaceFromId(id);
      if (result) {
        setFormData(prev => ({
          ...prev,
          placeName: result.formData.placeName
        }));
      }
    }

    loadPlace();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSend = async () => {
    if (formData.email == "" || formData.testo == "") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = await mailContact(formData, captchaToken)
    if (result.success) {
      setSuccess(true)
    }
  };

  const renderSuccess = () => {
    handleConfetti()
    return (
      <div className="flex flex-1 justify-center">
        <div className="flex flex-col gap-10 justify-center items-center w-[90%]">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className="text-[1.6rem]">{successTextByType[type][0]}</span>
              <p className="font-medium text-[1.2rem]">{successTextByType[type][1]}</p>
            </div>
            <p className="text-center">Ti ringraziamo per averci contattato. La tua richiesta è stata ricevuta e sarà elaborata nei prossimi giorni.</p>
          </div>
          {showHeaderFooter && <Link href="/" className="cta-button outline"><div><BiHome size={20} /></div>Torna alla home</Link>}
        </div>
      </div>
    )
  }

  return (
    <>
      {
        success ? renderSuccess()
          :
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 items-center justify-between">
              <div className="w-full flex flex-col gap-4">
                <h3 className="w-full font-medium">Compila il form e invialo al team di FocusSpot!</h3>
                <input className="input w-full text-[16px]"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Inserisci la tua email" />
                {
                  formData.placeName &&
                  (<div className="w-full px-5 py-3 bg-(--contrast-01) rounded-(--border-radius)">
                    <p className="font-medium">Luogo d'interesse:</p>
                    <p>{formData.placeName}</p>
                  </div>
                  )
                }
                <select
                  value={formData.oggetto}
                  name="oggetto"
                  onChange={handleChange}
                  className="select">
                  {oggettiByType[type].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <textarea
                  className="textarea w-full text-[16px] h-[300px]"
                  name="testo"
                  value={formData.testo}
                  onChange={handleChange}
                  placeholder={bodyPlaceholdersByType[type]}
                />
              </div>
              <div>
                <TurnstileCaptcha onVerify={(token) => setCaptchaToken(token)} />
              </div>
              <button className={btnClasses} onClick={handleSend}><BiSend size={20} />Invia</button>
            </div >
          </div >
      }
    </>
  );
}