"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"
import { RewardsPage } from "@/components/editor/rewards/rewards-page"

export default function RewardsEditorPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [currency, setCurrency] = useState("KZT")
  const [rewardCount, setRewardCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      Promise.all([
        fetch(`/api/projects/${projectId}`).then((r) => r.json()),
        fetch(`/api/projects/${projectId}/rewards`).then((r) => r.json()),
      ])
        .then(([projData, rewardsData]) => {
          setCurrency(projData.project?.currency || "KZT")
          setRewardCount(rewardsData.rewards?.length || 0)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, projectId, router])

  const checklist = [
    { label: "At least 1 reward tier", done: rewardCount > 0 },
  ]

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <EditorLayout projectId={projectId} checklist={checklist}>
      <RewardsPage projectId={projectId} currency={currency} onRewardCountChange={setRewardCount} />
    </EditorLayout>
  )
}
