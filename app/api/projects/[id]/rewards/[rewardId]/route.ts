import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; rewardId: string }> }
) {
  try {
    const { id, rewardId } = await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.rewardTier.delete({ where: { id: rewardId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reward delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
