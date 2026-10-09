import { redirect } from "next/navigation";
import { getProject, projectDetails } from "@/content/project-chapters";

export async function generateStaticParams() {
  return projectDetails.map((p) => ({ slug: p.slug }));
}

/**
 * `/projets/{slug}` mène au premier chapitre.
 *
 * Une redirection plutôt qu'un rendu : sans elle, la vue d'ensemble aurait deux
 * URL pour un même contenu, ce que les moteurs traitent comme du duplicata.
 */
export default async function ProjetIndex({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projet = getProject(slug);
  redirect(`/projets/${slug}/${projet?.chapters[0]?.slug ?? "vue-densemble"}`);
}
