"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"
import { PeoplePage } from "@/components/editor/people/people-page"

export default function PeopleEditorPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [vanitySlug, setVanitySlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetch(`/api/projects/${projectId}`)
        .then((r) => r.json())
        .then((d) => {
          setVanitySlug(d.project?.vanitySlug || null)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, projectId, router])

  const checklist = [
    { label: "Vanity URL", done: !!vanitySlug },
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
      <PeoplePage projectId={projectId} vanitySlug={vanitySlug} onSlugChange={setVanitySlug} />
    </EditorLayout>
  )
}
