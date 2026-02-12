import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    const where: Record<string, unknown> = { status: "active" }
    if (category && category !== "All") {
      where.category = category.toLowerCase()
    }

    const projects = await prisma.project.findMany({
      where,
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
          image: p.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
          funded: stats._sum.amount || 0,
          goal: p.goalAmount || 0,
          backers: p._count.pledges,
          daysLeft: p.deadline
            ? Math.max(0, Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000))
            : p.durationDays || 30,
          category: p.category,
        }
      })
    )

    return NextResponse.json({ projects: withStats })
  } catch (error) {
    console.error("Browse error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
