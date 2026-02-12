"use client"

import { Navigation, FeaturedProjects, Footer } from "../components"
import { featuredProjects } from "../data/projects"
import { useState, useEffect } from "react"
import type { Project } from "../types"

const categories = [
  "All",
  "Technology",
  "Art",
  "Food",
  "Games",
  "Publishing",
  "Fashion",
  "Social",
]

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [projects, setProjects] = useState<Project[]>(featuredProjects)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/projects/browse?category=${selectedCategory}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.projects && d.projects.length > 0) {
          setProjects(d.projects)
        } else if (selectedCategory === "All") {
          setProjects(featuredProjects)
        } else {
          setProjects([])
        }
        setLoading(false)
      })
      .catch(() => {
        setProjects(featuredProjects)
        setLoading(false)
      })
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <div className="border-b-2 border-black">
          <div className="px-4 md:px-6 max-w-[1200px] mx-auto py-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  All projects
                </h1>
                <p className="text-[#666]">
                  {projects.length} project{projects.length !== 1 ? "s" : ""} currently funding
                </p>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 border-2 border-black font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 max-w-[1200px] mx-auto py-16">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">No projects found</h2>
              <p className="text-[#666]">Try a different category</p>
            </div>
          ) : (
            <FeaturedProjects projects={projects} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
