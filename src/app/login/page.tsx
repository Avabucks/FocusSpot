import Footer from "@/src/components/navigation/Footer";
import Navbar from "@/src/components/navigation/NavBar";
import FormLogin from "@/src/components/user/FormLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi - FocusSpot",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.",
};

export default function Login() {
  return (
    <>
      <Navbar />
      <section>
        <FormLogin />
      </section>
      <Footer />
    </>
  );
}