import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username } = await params
    const target = await prisma.user.findUnique({ where: { username } })
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (target.id === session.user.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: target.id },
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ following: true })
    }
    console.error("Follow error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username } = await params
    const target = await prisma.user.findUnique({ where: { username } })
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.follow.deleteMany({
      where: { followerId: session.user.id, followingId: target.id },
    })

    return NextResponse.json({ following: false })
  } catch (error) {
    console.error("Unfollow error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
