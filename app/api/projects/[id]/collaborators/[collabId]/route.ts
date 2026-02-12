import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; collabId: string }> }
) {
  try {
    const { id, collabId } = await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.collaborator.delete({ where: { id: collabId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Collaborator remove error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
