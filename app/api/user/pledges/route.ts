import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pledges = await prisma.pledge.findMany({
      where: { userId: session.user.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            currency: true,
            imageUrl: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const totalBacked = pledges.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({ pledges, totalBacked })
  } catch (error) {
    console.error("User pledges error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
