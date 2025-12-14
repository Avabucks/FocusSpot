import FormAggiungi from "@/src/components/user/FormAggiungi";
import Footer from "@/src/components/navigation/Footer";
import CheckModerator from "@/src/components/admin/CheckModerator";
import UserCard from "@/src/components/user/UserCard";
import Navbar from "@/src/components/navigation/NavBar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id == "new")
    return {
      title: `Aggiungi Luogo - FocusSpot`,
      description: `FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.`,
    };
  else
    return {
      title: `Modifica Luogo - FocusSpot`,
      description: `FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. FocusSpot ti guida verso il luogo perfetto per te.`,
    }
}

export default async function Profilo({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params

  const renderPage = () => (
    <>
      <Navbar />
      <section>
        <UserCard />
        <FormAggiungi id={id}></FormAggiungi>
      </section>
      <Footer />
    </>
  )

  if (id === "new") {
    return (
      <>
        {renderPage()}
      </>
    )
  } else {
    return (<CheckModerator load={true} closeOnError={true}>
      <>
        {renderPage()}
      </>
    </CheckModerator>)
  }

}