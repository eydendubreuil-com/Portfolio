import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site.config";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WaveGridBackground } from "@/components/ui/wave-grid-background";
import { ContextCursor } from "@/components/ui/ContextCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1224",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Entrepreneur, créateur et développeur de projets IA",
  nationality: "FR",
  sameAs: site.socials.map((s) => s.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `dark` : AnimatedRays lit cette classe sur <html> pour choisir son filtre.
  // Sans elle il applique invert(100%) et devient un aplat blanc. Le site n'a
  // qu'un seul thème, la classe est donc constante.
  return (
    <html lang="fr" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Grille d'onde, derrière toute la page.
            `fixed` : le canvas fait la taille du viewport, pas celle du
            document — le coût par image ne dépend donc pas de la longueur de
            la page. `-z-10` et non `z-0` : un élément positionné à z-index 0
            se peint APRÈS le contenu non positionné et recouvrirait les
            sections. En négatif, il passe sous le contenu tout en restant
            au-dessus du fond de page. */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          {/* Opacité remontée depuis 0,55 : l'effet n'est plus étalé partout,
              il est concentré dans le halo du curseur. Au même réglage qu'avant
              il aurait été deux fois moins lisible là où il compte. */}
          <WaveGridBackground opacity={0.9} />
        </div>

        <a
          href="#projets"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60]
                     focus:rounded-[var(--radius-sm)] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Aller au contenu
        </a>

        {/* Une seule instance pour tout le site : la pastille suit le pointeur
            et ne se transforme que sur les zones portant `data-curseur`. */}
        <ContextCursor />

        <Nav />
        {children}
        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
