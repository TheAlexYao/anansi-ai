import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { AnansiWorkbench } from "../components/AnansiWorkbench";
import type { Project } from "../types/project";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const DEFAULT_PROJECT = "hinter-pitch-film";

async function loadProject(slug: string): Promise<Project> {
  if (!SLUG_PATTERN.test(slug)) notFound();
  const filePath = path.join(process.cwd(), "data", "examples", slug, "project.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Project;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") notFound();
    throw error;
  }
}

export default async function WorkbenchPage({
  searchParams
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: slug = DEFAULT_PROJECT } = await searchParams;
  const project = await loadProject(slug);
  return <AnansiWorkbench project={project} />;
}
