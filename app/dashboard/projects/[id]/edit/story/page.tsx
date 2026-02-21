"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const markdownHints = [
  { syntax: "# Heading", result: "Large heading" },
  { syntax: "## Subheading", result: "Smaller heading" },
  { syntax: "**bold text**", result: "Bold text" },
  { syntax: "*italic text*", result: "Italic text" },
  { syntax: "- Item", result: "Bullet list" },
  { syntax: "1. Item", result: "Numbered list" },
  { syntax: "[text](url)", result: "Link" },
  { syntax: "> quote", result: "Block quote" },
  { syntax: "---", result: "Horizontal line" },
  { syntax: "| A | B |\\n|---|---|", result: "Table" },
]

const starterTemplate = `## What we're making

Describe your project here. What is it? What problem does it solve?

## Why it matters

Explain why backers should care.

## How the funds will be used

Break down where the money goes:
- **40%** — Production
- **30%** — Materials
- **20%** — Shipping
- **10%** — Platform fees

## Timeline

| Phase | Date |
|-------|------|
| Funding ends | Month X |
| Production begins | Month Y |
| Shipping to backers | Month Z |

## Risks and challenges

Be honest about what could go wrong and how you'll handle it.
`

export default function StoryPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [dirty, setDirty] = useState(false)
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetch(`/api/projects/${projectId}`)
        .then((r) => r.json())
        .then((d) => {
          setDescription(d.project?.description || "")
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, projectId, router])

  const handleSave = useCallback(async () => {
    setSaveStatus("saving")
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })
      if (res.ok) {
        setSaveStatus("saved")
        setDirty(false)
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    }
  }, [projectId, description])

  const insertTemplate = () => {
    setDescription(starterTemplate)
    setDirty(true)
  }

  const insertAtCursor = (syntax: string) => {
    const textarea = document.getElementById("story-editor") as HTMLTextAreaElement | null
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newVal = description.slice(0, start) + syntax + description.slice(end)
    setDescription(newVal)
    setDirty(true)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + syntax.length, start + syntax.length)
    }, 0)
  }

  const checklist = [
    { label: "Project description", done: description.length > 20 },
  ]

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <EditorLayout projectId={projectId} saveStatus={saveStatus} dirty={dirty} onSave={handleSave} checklist={checklist}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Tell your story</h2>
          <p className="text-sm text-[#666]">
            Describe what you&apos;re making, why it matters, and how backers can help. Supports Markdown formatting.
          </p>
        </div>

        <div className="border-2 border-black">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] px-3">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "write" ? "border-black text-black" : "border-transparent text-[#999]"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "preview" ? "border-black text-black" : "border-transparent text-[#999]"
                }`}
              >
                Preview
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHints(!showHints)}
                className="text-xs text-[#999] hover:text-black transition-colors px-2 py-1"
              >
                {showHints ? "Hide" : "Formatting"} help
              </button>
            </div>
          </div>

          {activeTab === "write" && (
            <div>
              <div className="flex gap-1 px-3 py-2 border-b border-[#eee] bg-[#fafafa]">
                <button type="button" onClick={() => insertAtCursor("## ")} className="px-2 py-1 text-xs font-bold hover:bg-[#eee] transition-colors" title="Heading">H</button>
                <button type="button" onClick={() => insertAtCursor("**bold**")} className="px-2 py-1 text-xs font-bold hover:bg-[#eee] transition-colors" title="Bold">B</button>
                <button type="button" onClick={() => insertAtCursor("*italic*")} className="px-2 py-1 text-xs italic hover:bg-[#eee] transition-colors" title="Italic">I</button>
                <button type="button" onClick={() => insertAtCursor("\n- ")} className="px-2 py-1 text-xs hover:bg-[#eee] transition-colors" title="List">&bull;</button>
                <button type="button" onClick={() => insertAtCursor("\n> ")} className="px-2 py-1 text-xs hover:bg-[#eee] transition-colors" title="Quote">&ldquo;</button>
                <button type="button" onClick={() => insertAtCursor("\n---\n")} className="px-2 py-1 text-xs hover:bg-[#eee] transition-colors" title="Divider">&mdash;</button>
                <button type="button" onClick={() => insertAtCursor("[link text](https://)")} className="px-2 py-1 text-xs underline hover:bg-[#eee] transition-colors" title="Link">Link</button>
                <button type="button" onClick={() => insertAtCursor("\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell     | Cell     |\n")} className="px-2 py-1 text-xs hover:bg-[#eee] transition-colors" title="Table">Table</button>
              </div>
              <textarea
                id="story-editor"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDirty(true)
                }}
                placeholder="Write your project story here..."
                className="w-full min-h-[500px] p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none"
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="p-6 min-h-[500px]">
              {description ? (
                <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-[#333] prose-p:leading-relaxed prose-li:text-[#333] prose-strong:text-black prose-a:text-black prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:text-[#666] prose-hr:border-black prose-table:border-collapse prose-th:border prose-th:border-[#ccc] prose-th:px-3 prose-th:py-2 prose-th:bg-[#fafafa] prose-th:text-left prose-th:font-bold prose-td:border prose-td:border-[#ccc] prose-td:px-3 prose-td:py-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-[#999] text-sm">Nothing to preview yet. Start writing in the Write tab.</p>
              )}
            </div>
          )}
        </div>

        {showHints && (
          <div className="border-2 border-black p-5 space-y-4">
            <h3 className="font-bold text-sm">Markdown quick reference</h3>
            <div className="grid grid-cols-2 gap-2">
              {markdownHints.map((hint) => (
                <div key={hint.syntax} className="flex items-center gap-3">
                  <code className="text-xs bg-[#f5f5f5] px-2 py-1 font-mono">{hint.syntax}</code>
                  <span className="text-xs text-[#666]">{hint.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!description && (
          <div className="border-2 border-dashed border-[#ccc] p-6 text-center">
            <p className="text-sm text-[#666] mb-3">Not sure where to start?</p>
            <Button type="button" variant="outline" onClick={insertTemplate}>
              Use a starter template
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#999]">
          <span>{description.length} characters</span>
          <span>Markdown supported</span>
        </div>

        <div className="sticky bottom-0 bg-white border-t-2 border-black py-4 -mx-4 px-4 md:-mx-6 md:px-6">
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!dirty || saveStatus === "saving"} size="lg">
              {saveStatus === "saving" ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </EditorLayout>
  )
}
