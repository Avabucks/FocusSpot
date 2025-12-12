import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import "../styles/animations.css";
import Navbar from "@/src/components/navigation/NavBar";
import { UserProvider } from "@/src/context/UserContext";
import { cookies } from "next/headers";
import { getUser } from "@/src/actions/users_actions";
import Analytics from "../components/ui/Analytics";
import ScrollToTop from "../components/ui/ScrollToTop";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://focusspot.vercel.app'),
  title: "FocusSpot | Spazi Studio",
  description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. Che tu stia cercando una biblioteca silenziosa per concentrarti sui tuoi esami, un caffè accogliente per lavorare al tuo progetto, o uno spazio di coworking dove incontrare altre persone motivate, FocusSpot ti guida verso il luogo perfetto per te.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    title: "FocusSpot | Spazi Studio",
    description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. Che tu stia cercando una biblioteca silenziosa per concentrarti sui tuoi esami, un caffè accogliente per lavorare al tuo progetto, o uno spazio di coworking dove incontrare altre persone motivate, FocusSpot ti guida verso il luogo perfetto per te.",
    images: ["/social.png"],
  },
  twitter: {
    card: 'summary',
    title: "FocusSpot | Spazi Studio",
    description: "FocusSpot è l'app che ti aiuta a scoprire i migliori spazi di studio e lavoro condivisi nella tua città. Che tu stia cercando una biblioteca silenziosa per concentrarti sui tuoi esami, un caffè accogliente per lavorare al tuo progetto, o uno spazio di coworking dove incontrare altre persone motivate, FocusSpot ti guida verso il luogo perfetto per te.",
  },
  appleWebApp: {
    title: 'FocusSpot',
    startupImage: [
      '/apple-touch-icon.png',
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const token = cookieStore.get("user")?.value;
  const user = token ? await getUser(JSON.parse(token).username, JSON.parse(token).uid) : null;

  return (
    <html lang="it">
      <head>

      </head>
      <body
        className={`${poppins.variable} antialiased light`}
        data-scroll-behavior="smooth"
      >
        <div className="flex flex-col min-h-full overflow-auto md:w-[500px] md:border md:border-(--contrast-01) m-auto bg-(--bg)">
          <ScrollToTop />
          <UserProvider initialUser={user}>
            <Analytics></Analytics>
            <Navbar />
            <main className="flex flex-col h-full flex-1">{children}</main>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}

// TODOs:
// - caricare .apk su public e mettere nel button download
// - fare api