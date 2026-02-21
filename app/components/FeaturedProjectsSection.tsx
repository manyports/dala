"use client"

import { useState, useEffect } from "react"
import { FeaturedProjects } from "./FeaturedProjects"
import { featuredProjects } from "../data/projects"
import type { Project } from "../types"

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  const displayProjects =
    !loading && projects && projects.length > 0 ? projects : featuredProjects.slice(0, 3)

  return <FeaturedProjects projects={displayProjects} />
}
