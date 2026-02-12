"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/store/wizard-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthStep() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const store = useWizardStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [projectCreated, setProjectCreated] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newsletter: false,
  })

  useEffect(() => {
    if (status === "authenticated" && session && !projectCreated) {
      setProjectCreated(true)
      handleCreateProject()
    }
  }, [status, session])

  const handleBack = () => {
    store.setCurrentStep(2)
  }

  const handleCreateProject = async () => {
    setLoading(true)
    try {
      const { category, subcategory, country, currency } = useWizardStore.getState()

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          subcategory,
          country,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create project")
        setLoading(false)
        return
      }

      store.reset()
      router.push(`/dashboard/projects/${data.projectId}`)
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
        setLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but login failed")
        setLoading(false)
        return
      }
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#666]">
          {status === "authenticated" ? "Creating your project..." : "Loading..."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <p className="text-sm text-[#666] mb-6">
          Have an account?{" "}
          <Link href="/login" className="text-black font-bold hover:opacity-60 transition-opacity">
            Log in
          </Link>
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Please sign up to continue
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-mono uppercase tracking-wider mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            className="w-full border-2 border-black px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-mono uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full border-2 border-black px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-mono uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="At least 8 characters"
            className="w-full border-2 border-black px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
            minLength={8}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-3 pt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
              className="mt-1 w-4 h-4 border-2 border-black focus:ring-2 focus:ring-black"
              disabled={loading}
            />
            <span className="text-sm text-[#666]">
              Send me a weekly mix of handpicked projects, plus occasional Dala news
            </span>
          </label>
        </div>

        {error && (
          <div className="p-4 border-2 border-black bg-neutral-100">
            <p className="text-sm text-black">{error}</p>
          </div>
        )}

        <div className="pt-6 space-y-4">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          
          <p className="text-xs text-[#666] text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-black hover:opacity-60">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-black hover:opacity-60">Privacy Policy</Link>.
          </p>
        </div>
      </form>

      <div className="flex justify-start pt-4 border-t-2 border-black">
        <Button
          size="lg"
          variant="outline"
          onClick={handleBack}
          className="px-8"
          disabled={loading}
        >
          ← Location
        </Button>
      </div>
    </div>
  )
}
