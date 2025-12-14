import FormContact from "@/src/components/contact/FormContact";
import Footer from "@/src/components/navigation/Footer";
import Navbar from "@/src/components/navigation/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contattaci - FocusSpot",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.",
};

export default async function Contact({
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
        <FormContact />
      </section>
      {showHeaderFooter && <Footer />}
    </>
  );
}