"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/app/components"

export default function LoginPage() {
  const router = useRouter()
  const { update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const canSubmit = email.includes("@") && password.length >= 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Wrong email or password. Double-check and try again.")
        setLoading(false)
        return
      }

      await update()

      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()
      const username = session?.user?.username

      if (username) {
        router.push(`/u/${username}`)
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch {
      setError("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-[480px]">
          <div className="h-1 bg-black mb-10" />

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Welcome back.
              </h1>
              <p className="text-lg text-[#666] leading-relaxed">
                Good to see you again. Let&apos;s pick up where you left off.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold">Password</label>
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-2 border-black"
                />
              </div>

              {error && (
                <div className="p-3 border-2 border-black bg-[#fafafa]">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={!canSubmit || loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <p className="text-sm text-center text-[#999]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black font-bold hover:opacity-60 transition-opacity">
                Create one
              </Link>
            </p>

            <div className="border-t border-[#e5e5e5] pt-5">
              <p className="text-xs text-[#999] text-center">
                By logging in, you agree to Dala&apos;s{" "}
                <Link href="/terms" className="text-black hover:opacity-60 transition-opacity">terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-black hover:opacity-60 transition-opacity">privacy policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
