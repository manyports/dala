import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { category, subcategory, country, currency } = await req.json()

    if (!category || !country || !currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title: "Untitled Project",
        description: "",
        category,
        subcategory,
        country,
        currency,
        status: "draft",
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { projectId: project.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
