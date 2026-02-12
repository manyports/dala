"use client"

import Image from "next/image"

interface ProjectHeroProps {
  title: string
  subtitle?: string
  category: string
  imageUrl?: string
  creatorName: string
}

export function ProjectHero({ title, subtitle, category, imageUrl, creatorName }: ProjectHeroProps) {
  return (
    <div className="border-b-2 border-black">
      {imageUrl && (
        <div className="relative w-full aspect-[21/9] bg-black max-h-[420px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-8">
        <div className="text-xs font-mono uppercase tracking-wider text-[#666] mb-3">
          {category}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-[#666] mb-4">{subtitle}</p>
        )}
        <p className="text-sm text-[#999]">by {creatorName}</p>
      </div>
    </div>
  )
}
