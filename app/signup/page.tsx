"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/app/components"
import { safeJsonParse } from "@/lib/utils"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleUsernameChange = (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "")
    setUsername(clean)
    setUsernameStatus("idle")

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (clean.length < 3) return

    debounceRef.current = setTimeout(async () => {
      setUsernameStatus("checking")
      try {
        const res = await fetch(`/api/auth/check-username?username=${clean}`)
        if (!res.ok) {
          setUsernameStatus("error")
          return
        }
        const data = await safeJsonParse<{ available: boolean }>(res)
        if (data) {
          setUsernameStatus(data.available ? "available" : "taken")
        } else {
          setUsernameStatus("error")
        }
      } catch {
        setUsernameStatus("error")
      }
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      })

      const data = await safeJsonParse<{ error?: string }>(response)

      if (!response.ok || !data) {
        setError(data?.error || "Something went wrong")
        setLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created. Try logging in.")
        setLoading(false)
        return
      }

      router.push(`/u/${username}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  const canContinueStep1 = name.trim().length > 0 && username.length >= 3 && usernameStatus === "available"
  const canContinueStep2 = email.includes("@") && password.length >= 8

  const passwordStrength = password.length === 0
    ? 0
    : password.length < 8
    ? 1
    : password.length < 12
    ? 2
    : 3

  const strengthLabels = ["", "Weak", "Good", "Strong"]
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-black"]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-[480px]">
          <div className="flex gap-2 mb-10">
            <div className={`h-1 flex-1 ${step >= 1 ? "bg-black" : "bg-[#eee]"} transition-colors`} />
            <div className={`h-1 flex-1 ${step >= 2 ? "bg-black" : "bg-[#eee]"} transition-colors`} />
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#999] mb-4">Step 1 of 2</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                  Hey there.
                </h1>
                <p className="text-lg text-[#666] leading-relaxed">
                  Let&apos;s get you set up. Whether you want to back amazing projects
                  or launch your own &#8212; it starts with your identity.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold">What should we call you?</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="h-12 border-2 border-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold">Pick a username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] font-mono">@</span>
                    <Input
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="yourname"
                      className="h-12 border-2 border-black pl-9 font-mono"
                      maxLength={20}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#999]">
                      {usernameStatus === "checking" && "Checking availability..."}
                      {usernameStatus === "available" && (
                        <span className="text-green-700 font-medium">@{username} is yours</span>
                      )}
                      {usernameStatus === "taken" && (
                        <span className="text-red-600">@{username} is taken</span>
                      )}
                      {usernameStatus === "error" && (
                        <span className="text-red-600">Could not check. Try again.</span>
                      )}
                      {usernameStatus === "idle" && username.length > 0 && username.length < 3 && "At least 3 characters"}
                      {usernameStatus === "idle" && username.length === 0 && "Letters, numbers, underscores. This is your public handle."}
                    </p>
                    <span className="text-xs text-[#999]">{username.length}/20</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!canContinueStep1}
                className="w-full h-12"
              >
                Continue
              </Button>

              <p className="text-sm text-center text-[#999]">
                Already have an account?{" "}
                <Link href="/login" className="text-black font-bold hover:opacity-60 transition-opacity">Log in</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#999] mb-4">Step 2 of 2</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                  Almost there, {name.split(" ")[0]}.
                </h1>
                <p className="text-lg text-[#666] leading-relaxed">
                  Just need your email and a password. Then you&apos;re in.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 border-2 border-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="h-12 border-2 border-black"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 transition-colors ${
                            passwordStrength >= level ? strengthColors[passwordStrength] : "bg-[#eee]"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <span className="text-xs text-[#999]">{strengthLabels[passwordStrength]}</span>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 border-2 border-black bg-[#fafafa]">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-12 px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canContinueStep2 || loading}
                  className="flex-1 h-12"
                >
                  {loading ? "Creating your account..." : "Create account"}
                </Button>
              </div>

              <div className="border-t border-[#e5e5e5] pt-5">
                <p className="text-xs text-[#999] text-center">
                  You&apos;ll be @{username} on Dala. You can back projects, follow creators, and launch your own campaigns -- all from one account.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
