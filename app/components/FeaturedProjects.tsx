"use client"

import { useState } from "react"
import { ProjectCard } from "./ProjectCard"
import type { Project } from "../types"

interface FeaturedProjectsProps {
  projects: Project[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="grid gap-8">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            isHovered={hovered !== null && hovered !== project.id}
            onHover={setHovered}
          />
        ))}
    </div>
  )
}
