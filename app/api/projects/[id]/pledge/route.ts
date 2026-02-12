import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, rewardId } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Pledge amount must be at least 1" }, { status: 400 })
    }

    const project = await prisma.project.findFirst({
      where: { id, status: { not: "draft" } },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or not active" }, { status: 404 })
    }

    if (project.userId === session.user.id) {
      return NextResponse.json({ error: "You cannot back your own project" }, { status: 400 })
    }

    const pledge = await prisma.pledge.create({
      data: {
        amount,
        rewardId: rewardId || null,
        projectId: id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ pledge }, { status: 201 })
  } catch (error) {
    console.error("Pledge error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pledges = await prisma.pledge.aggregate({
      where: { projectId: id },
      _sum: { amount: true },
      _count: true,
    })

    return NextResponse.json({
      totalRaised: pledges._sum.amount || 0,
      backerCount: pledges._count,
    })
  } catch (error) {
    console.error("Pledge stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
