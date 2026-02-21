"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/store/wizard-store"
import { WizardLayout } from "@/components/wizard/wizard-layout"
import { CategoryStep } from "@/components/wizard/steps/category-step"
import { LocationStep } from "@/components/wizard/steps/location-step"
import { AuthStep } from "@/components/wizard/steps/auth-step"
import { useState, useEffect, useCallback } from "react"

export default function WizardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentStep } = useWizardStore()
  const [creatingProject, setCreatingProject] = useState(false)

  const isLoggedIn = status === "authenticated" && !!session

  const createProjectAndRedirect = useCallback(async () => {
    const { category, subcategory, country, currency, reset } =
      useWizardStore.getState()

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subcategory, country, currency }),
      })

      const data = await response.json()

      if (response.ok) {
        reset()
        router.push(`/dashboard/projects/${data.projectId}`)
      } else {
        setCreatingProject(false)
      }
    } catch {
      setCreatingProject(false)
    }
  }, [router])

  useEffect(() => {
    if (isLoggedIn && currentStep === 3 && !creatingProject) {
      const id = setTimeout(() => {
        setCreatingProject(true)
        createProjectAndRedirect()
      }, 0)
      return () => clearTimeout(id)
    }
  }, [isLoggedIn, currentStep, creatingProject, createProjectAndRedirect])

  if (creatingProject) {
    return (
      <WizardLayout totalSteps={isLoggedIn ? 2 : 3}>
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#666]">Creating your project...</p>
        </div>
      </WizardLayout>
    )
  }

  const totalSteps = isLoggedIn ? 2 : 3

  return (
    <WizardLayout totalSteps={totalSteps}>
      {currentStep === 1 && <CategoryStep />}
      {currentStep === 2 && <LocationStep isLastStep={isLoggedIn} />}
      {currentStep === 3 && !isLoggedIn && <AuthStep />}
    </WizardLayout>
  )
}
