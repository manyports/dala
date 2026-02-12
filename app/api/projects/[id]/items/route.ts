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

    const items = await prisma.item.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } })
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Items fetch error:", error)
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

    const { title, description, imageUrl } = await req.json()
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

    const item = await prisma.item.create({
      data: { title, description, imageUrl, projectId: id },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Item create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
