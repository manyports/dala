import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        interests: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data: Record<string, unknown> = {}

    if (typeof body.name === "string") {
      data.name = body.name.trim() || null
    }

    if (typeof body.bio === "string") {
      data.bio = body.bio.trim() || null
    }

    if (Array.isArray(body.interests)) {
      data.interests = body.interests.filter((i: unknown) => typeof i === "string")
    }

    if (typeof body.username === "string") {
      const username = body.username.toLowerCase().trim()
      if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        return NextResponse.json(
          { error: "Username must be 3-20 characters, lowercase letters, numbers, and underscores only" },
          { status: 400 }
        )
      }
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: session.user.id } },
      })
      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
      data.username = username
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        interests: true,
        image: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
