"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "../types"

interface ProjectCardProps {
  project: Project
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
}

export function ProjectCard({ project, index, isHovered, onHover }: ProjectCardProps) {
  const progress = Math.round((project.funded / project.goal) * 100)

  return (
    <Link href={`/projects/${project.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      className={`group border-2 border-black hover:shadow-xl transition-all mb-8 cursor-pointer ${
        isHovered ? "opacity-40" : "opacity-100"
      }`}
    >
      <div className="relative w-full aspect-[16/9] bg-black overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-mono uppercase tracking-wider">
          {project.category}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
          {project.title}
        </h3>
        <p className="text-sm text-[#666] mb-4">by {project.creator}</p>
        <p className="text-[#666] leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="space-y-4">
          <div className="h-2 bg-[#eee] w-full">
            <motion.div 
              className="h-full bg-black"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 + index * 0.1 }}
            />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold tabular-nums">
                ${(project.funded / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-[#666]">
                raised of ${(project.goal / 1000).toFixed(0)}K goal
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{project.backers.toLocaleString()}</div>
              <div className="text-sm text-[#666]">backers</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{project.daysLeft}</div>
              <div className="text-sm text-[#666]">days left</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}
