"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation, Footer } from "@/app/components"
import { ProjectHero } from "@/components/project/project-hero"
import { PledgeSidebar } from "@/components/project/pledge-sidebar"
import { RewardSelector } from "@/components/project/reward-selector"

interface RewardTier {
  id: string
  title: string
  description?: string
  amount: number
  shippingType: string
  quantityLimit?: number | null
}

interface ProjectData {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  country: string
  currency: string
  imageUrl?: string
  goalAmount?: number
  fundingType: string
  status: string
  durationDays?: number
  deadline?: string
  createdAt: string
  user: { id: string; name?: string; username?: string; image?: string }
  rewardTiers: RewardTier[]
  totalRaised: number
  backerCount: number
  creatorProjectCount: number
}

export default function PublicProjectPage() {
  const params = useParams()
  const { data: session } = useSession()
  const projectId = params.id as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    fetch(`/api/projects/${projectId}/public`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project not found</h1>
            <p className="text-[#666]">This project doesn&apos;t exist or hasn&apos;t been published yet.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currencySymbols: Record<string, string> = { KZT: "₸", RUB: "₽", UAH: "₴", BYN: "Br" }
  const symbol = currencySymbols[project.currency] || "$"
  const goal = project.goalAmount || 0
  const progress = goal > 0 ? Math.min(100, Math.round((project.totalRaised / goal) * 100)) : 0

  const daysLeft = project.deadline
    ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - now) / 86400000))
    : project.durationDays || 30

  const isOwner = session?.user?.id === project.user.id

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {isOwner && (
        <div className="border-b-2 border-black bg-[#fafafa]">
          <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            <p className="text-sm">You are viewing your own project.</p>
            <Link href={`/dashboard/projects/${project.id}`}>
              <Button size="sm" variant="outline" className="h-8 text-xs">Edit project</Button>
            </Link>
          </div>
        </div>
      )}

      <main>
        <ProjectHero
          title={project.title}
          subtitle={project.subtitle}
          category={project.category}
          imageUrl={project.imageUrl}
          creatorName={project.user.name || "Anonymous"}
        />

        <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="h-3 bg-[#eee] w-full">
                  <div className="h-full bg-black transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold tabular-nums">
                      {symbol}{project.totalRaised.toLocaleString()}
                    </div>
                    <div className="text-sm text-[#666]">
                      raised of {symbol}{goal.toLocaleString()} goal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{project.backerCount}</div>
                    <div className="text-sm text-[#666]">backers</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{daysLeft}</div>
                    <div className="text-sm text-[#666]">days left</div>
                  </div>
                </div>
              </div>

              {project.description && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">About this project</h2>
                  <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-[#333] prose-p:leading-relaxed prose-li:text-[#333] prose-strong:text-black prose-a:text-black prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:text-[#666] prose-hr:border-black prose-table:border-collapse prose-th:border prose-th:border-[#ccc] prose-th:px-3 prose-th:py-2 prose-th:bg-[#fafafa] prose-th:text-left prose-th:font-bold prose-td:border prose-td:border-[#ccc] prose-td:px-3 prose-td:py-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
                  </div>
                </section>
              )}

              {project.rewardTiers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Reward tiers</h2>
                  <RewardSelector
                    rewards={project.rewardTiers}
                    currency={symbol}
                    projectId={project.id}
                  />
                </section>
              )}

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-bold mb-4">About the creator</h2>
                <Link
                  href={project.user.username ? `/u/${project.user.username}` : "#"}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {project.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{project.user.name || "Anonymous"}</p>
                    {project.user.username && (
                      <p className="text-sm text-[#666] font-mono">@{project.user.username}</p>
                    )}
                    <p className="text-sm text-[#666]">
                      {project.creatorProjectCount} project{project.creatorProjectCount !== 1 ? "s" : ""} on Dala
                    </p>
                  </div>
                </Link>
              </section>
            </div>

            <div className="hidden lg:block">
              <PledgeSidebar
                projectId={project.id}
                currency={symbol}
                rewards={project.rewardTiers}
                status={project.status}
                creatorId={project.user.id}
              />
            </div>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-black p-4">
          <PledgeSidebar
            projectId={project.id}
            currency={symbol}
            rewards={project.rewardTiers}
            status={project.status}
            creatorId={project.user.id}
            mobile
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
