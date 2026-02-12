import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { rewardTiers: true, collaborators: true },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Project fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const body = await req.json()

    const allowedFields = [
      "title", "subtitle", "description", "category", "subcategory",
      "location", "goalAmount", "fundingType", "durationDays", "deadline",
      "imageUrl", "videoUrl", "vanitySlug", "shippingType", "entityType", "status",
    ]

    const data: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in body) {
        if (key === "deadline" && body[key]) {
          data[key] = new Date(body[key])
        } else {
          data[key] = body[key]
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data,
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
