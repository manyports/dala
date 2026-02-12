import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "followers"

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (type === "following") {
      const following = await prisma.follow.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: { id: true, name: true, username: true, image: true, bio: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ users: following.map((f) => f.following) })
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
          select: { id: true, name: true, username: true, image: true, bio: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ users: followers.map((f) => f.follower) })
  } catch (error) {
    console.error("Followers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
