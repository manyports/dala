"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const editorTabs = [
  { href: "basics", label: "Basics" },
  { href: "rewards", label: "Rewards" },
  { href: "story", label: "Story" },
  { href: "people", label: "People" },
  { href: "payment", label: "Payment" },
]

interface CheckItem {
  label: string
  done: boolean
}

interface EditorLayoutProps {
  projectId: string
  children: React.ReactNode
  saveStatus?: "idle" | "saving" | "saved" | "error"
  onSave?: () => void
  dirty?: boolean
  checklist?: CheckItem[]
}

export function EditorLayout({ projectId, children, saveStatus = "idle", onSave, dirty, checklist }: EditorLayoutProps) {
  const pathname = usePathname()
  const activeTab = pathname.split("/").pop()

  const doneCount = checklist?.filter((c) => c.done).length ?? 0
  const totalCount = checklist?.length ?? 0
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black sticky top-0 z-50 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="h-14 flex items-center justify-between">
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="text-sm font-medium hover:opacity-60 transition-opacity"
            >
              &larr; Back to project
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-xs text-[#999]">
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "All changes saved"}
                {saveStatus === "error" && "Save failed"}
              </span>
              {dirty && onSave && (
                <Button size="sm" onClick={onSave}>
                  Save changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#e5e5e5] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {editorTabs.map((tab) => (
              <Link
                key={tab.href}
                href={`/dashboard/projects/${projectId}/edit/${tab.href}`}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.href
                    ? "border-black text-black"
                    : "border-transparent text-[#999] hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
        <div className={`${checklist && checklist.length > 0 ? "grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12" : ""}`}>
          <div className="max-w-3xl">
            {children}
          </div>

          {checklist && checklist.length > 0 && (
            <div className="hidden lg:block">
              <div className="sticky top-20 space-y-5">
                <div className="border-2 border-black p-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#666]">Progress</span>
                    <span className="text-lg font-bold tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-2 bg-[#eee]">
                    <div
                      className="h-full bg-black transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {checklist.map((item) => (
                      <div key={item.label} className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                          item.done ? "border-black bg-black" : "border-[#ccc]"
                        }`}>
                          {item.done && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs ${item.done ? "text-black" : "text-[#999]"}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
