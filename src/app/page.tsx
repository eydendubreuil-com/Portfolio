import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Intro } from "@/components/sections/Intro";
import { AboutSection } from "@/components/sections/AboutSection";
import { Timeline } from "@/components/sections/Timeline";
import { Projects } from "@/components/sections/Projects";
import { Focus } from "@/components/sections/Focus";
import { Skills } from "@/components/sections/Skills";
import { Stats } from "@/components/sections/Stats";
import { Vision } from "@/components/sections/Vision";
import { Contact } from "@/components/sections/Contact";
import { aboutSections } from "@/content/about";

/**
 * Douze sections. Les fonds alternent bg / surface pour que la séparation se
 * voie sans ajouter de traits ni d'ombres.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Positioning />

      <Intro />
      {aboutSections.map((s, i) => (
        <AboutSection key={s.id} data={s} index={i} surface={i % 2 === 1} />
      ))}

      <Timeline />
      <Projects />
      <Focus />
      <Skills />
      <Stats />
      <Vision />
      <Contact />
    </main>
  );
}
