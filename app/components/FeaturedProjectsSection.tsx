"use client"

import { useState, useEffect } from "react"
import { FeaturedProjects } from "./FeaturedProjects"
import { featuredProjects } from "../data/projects"
import type { Project } from "../types"

interface FeaturedProjectsSectionProps {
  initialProjects?: Project[]
}

export function FeaturedProjectsSection({
  initialProjects,
}: FeaturedProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(initialProjects === undefined)

  useEffect(() => {
    if (initialProjects !== undefined && initialProjects.length > 0) {
      return
    }
    fetch("/api/projects/browse?sort=random")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects && d.projects.length > 0) {
          setProjects(d.projects.slice(0, 3))
        } else {
          setProjects(featuredProjects.slice(0, 3))
        }
      })
      .catch(() => {
        setProjects(featuredProjects.slice(0, 3))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [initialProjects])

  const displayProjects =
    initialProjects !== undefined && initialProjects.length > 0
      ? initialProjects
      : !loading && projects && projects.length > 0
        ? projects
        : featuredProjects.slice(0, 3)

  return <FeaturedProjects projects={displayProjects} />
}
