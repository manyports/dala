import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { password, action } = await req.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required to confirm" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 })
    }

    if (action === "deactivate") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: "[Deactivated]", bio: null, interests: { set: [] } },
      })
      return NextResponse.json({ success: true, action: "deactivated" })
    }

    if (action === "delete") {
      await prisma.follow.deleteMany({
        where: { OR: [{ followerId: session.user.id }, { followingId: session.user.id }] },
      })
      await prisma.pledge.deleteMany({ where: { userId: session.user.id } })
      await prisma.project.deleteMany({ where: { userId: session.user.id } })
      await prisma.session.deleteMany({ where: { userId: session.user.id } })
      await prisma.account.deleteMany({ where: { userId: session.user.id } })
      await prisma.user.delete({ where: { id: session.user.id } })

      return NextResponse.json({ success: true, action: "deleted" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Account action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
