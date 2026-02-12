import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { iban, bank, holderName } = await req.json()

    if (!iban || !bank || !holderName) {
      return NextResponse.json({ error: "All payout fields are required" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Payout method saved" })
  } catch (error) {
    console.error("Payout save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
