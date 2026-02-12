import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        interests: true,
        createdAt: true,
        _count: { select: { followers: true, following: true, projects: true, pledges: true } },
        projects: {
          where: { status: "active" },
          select: {
            id: true,
            title: true,
            subtitle: true,
            category: true,
            imageUrl: true,
            currency: true,
            goalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let isFollowing = false
    const session = await auth()
    if (session?.user?.id && session.user.id !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: session.user.id, followingId: user.id } },
      })
      isFollowing = !!follow
    }

    return NextResponse.json({ user, isFollowing })
  } catch (error) {
    console.error("User profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
