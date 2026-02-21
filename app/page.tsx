import { getFeaturedProjects } from "@/lib/getFeaturedProjects"
import { featuredProjects } from "./data/projects"
import { HomeClient } from "./HomeClient"

export default async function Home() {
  let initialFeaturedProjects = featuredProjects.slice(0, 3)
  try {
    const fromDb = await getFeaturedProjects()
    if (fromDb.length > 0) {
      initialFeaturedProjects = fromDb
    }
  } catch {
    // keep static fallback
  }

  return <HomeClient initialFeaturedProjects={initialFeaturedProjects} />
}
