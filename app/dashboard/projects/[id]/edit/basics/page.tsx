"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"
import { BasicsForm } from "@/components/editor/basics/basics-form"

interface ProjectData {
  id: string
  title: string
  subtitle?: string | null
  category: string
  subcategory?: string | null
  location?: string | null
  country: string
  currency: string
  goalAmount?: number | null
  fundingType: string
  durationDays?: number | null
  deadline?: string | null
  imageUrl?: string | null
}

function getChecklist(data: ProjectData) {
  return [
    { label: "Title", done: !!data.title && data.title !== "Untitled Project" },
    { label: "Subtitle", done: !!data.subtitle },
    { label: "Category", done: !!data.category },
    { label: "Project image", done: !!data.imageUrl },
    { label: "Goal amount", done: !!data.goalAmount && data.goalAmount > 0 },
    { label: "Duration", done: !!data.durationDays || !!data.deadline },
  ]
}

export default function BasicsPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetchProject()
    }
  }, [status, projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
      }
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <EditorLayout
      projectId={projectId}
      saveStatus={saveStatus}
      dirty={dirty}
      checklist={getChecklist(project)}
    >
      <BasicsForm
        projectId={projectId}
        initialData={project}
        onSaveStatusChange={setSaveStatus}
        onDirtyChange={setDirty}
        onProjectUpdate={(updated) => setProject((prev) => prev ? { ...prev, ...updated } : prev)}
      />
    </EditorLayout>
  )
}
