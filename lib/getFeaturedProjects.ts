import { prisma } from "@/lib/prisma"
import type { Project } from "@/app/types"

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { status: "active" },
    include: {
      user: { select: { name: true } },
      _count: { select: { pledges: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const withStats = await Promise.all(
    projects.map(async (p) => {
      const stats = await prisma.pledge.aggregate({
        where: { projectId: p.id },
        _sum: { amount: true },
      })
      return {
        id: p.id,
        title: p.title,
        creator: p.user.name || "Anonymous",
        description: p.subtitle || p.description.slice(0, 150),
        image: p.imageUrl || DEFAULT_IMAGE,
        funded: stats._sum.amount || 0,
        goal: p.goalAmount || 0,
        backers: p._count.pledges,
        daysLeft: p.deadline
          ? Math.max(
              0,
              Math.ceil(
                (new Date(p.deadline).getTime() - Date.now()) / 86400000
              )
            )
          : p.durationDays || 30,
        category: p.category,
      }
    })
  )

  for (let i = withStats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[withStats[i], withStats[j]] = [withStats[j], withStats[i]]
  }

  return withStats.slice(0, 3)
}
