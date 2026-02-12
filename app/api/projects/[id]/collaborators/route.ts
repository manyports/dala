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
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const collaborators = await prisma.collaborator.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } })
    return NextResponse.json({ collaborators })
  } catch (error) {
    console.error("Collaborators fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { email, role } = await req.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    const collaborator = await prisma.collaborator.create({
      data: { email, role: role || "EDITOR", projectId: id },
    })

    return NextResponse.json({ collaborator }, { status: 201 })
  } catch (error) {
    console.error("Collaborator invite error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
