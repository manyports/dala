import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")?.trim()
    const type = searchParams.get("type") || "all"
    const category = searchParams.get("category")

    if (!q || q.length < 1) {
      return NextResponse.json({ users: [], projects: [] })
    }

    const results: { users: unknown[]; projects: unknown[] } = { users: [], projects: [] }

    if (type === "all" || type === "people") {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          _count: { select: { projects: true, followers: true } },
        },
        take: 10,
      })
    }

    if (type === "all" || type === "projects") {
      const where: Record<string, unknown> = {
        status: "active",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { subtitle: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }
      if (category) where.category = category

      results.projects = await prisma.project.findMany({
        where,
        select: {
          id: true,
          title: true,
          subtitle: true,
          category: true,
          imageUrl: true,
          currency: true,
          goalAmount: true,
          status: true,
          user: { select: { name: true, username: true } },
          _count: { select: { pledges: true } },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
