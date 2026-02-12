import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    const cursor = searchParams.get("cursor")
    const limit = 20

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        project: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            category: true,
            imageUrl: true,
            currency: true,
            goalAmount: true,
            status: true,
          },
        },
      },
    })

    const hasMore = posts.length > limit
    const results = hasMore ? posts.slice(0, limit) : posts
    const nextCursor = hasMore ? results[results.length - 1].id : null

    return NextResponse.json({ posts: results, nextCursor })
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, images, projectId } = await req.json()

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "Content too long (max 2000 characters)" }, { status: 400 })
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
      })
      if (!project) {
        return NextResponse.json({ error: "Project not found or not yours" }, { status: 400 })
      }
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        images: Array.isArray(images) ? images.filter((i: unknown) => typeof i === "string") : [],
        authorId: session.user.id,
        ...(projectId ? { projectId } : {}),
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        project: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            category: true,
            imageUrl: true,
            currency: true,
            goalAmount: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Post create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
