"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SearchUser {
  id: string
  name: string | null
  username: string | null
  image: string | null
  _count: { projects: number; followers: number }
}

interface SearchProject {
  id: string
  title: string
  subtitle: string | null
  category: string
  imageUrl: string | null
  user: { name: string | null; username: string | null }
}

type FilterType = "all" | "projects" | "people"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")
  const [users, setUsers] = useState<SearchUser[]>([])
  const [projects, setProjects] = useState<SearchProject[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const search = useCallback(async (q: string, type: FilterType) => {
    if (q.length < 1) {
      setUsers([])
      setProjects([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`)
      const data = await res.json()
      setUsers(data.users || [])
      setProjects(data.projects || [])
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) search(query.trim(), filter)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, filter, search])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [router])

  const handleSelect = () => {
    setOpen(false)
    setQuery("")
  }

  const hasResults = users.length > 0 || projects.length > 0
  const showDropdown = open && query.length > 0

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "projects", label: "Projects" },
    { key: "people", label: "People" },
  ]

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center border-2 transition-colors h-9 ${open ? "border-black" : "border-[#e5e5e5]"}`}>
        <svg className="w-4 h-4 ml-3 shrink-0 text-[#999]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search"
          className="w-full px-2 py-1 text-sm bg-transparent focus:outline-none placeholder:text-[#999]"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setUsers([]); setProjects([]) }}
            className="px-2 text-[#999] hover:text-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {!query && (
          <span className="text-[10px] font-mono text-[#ccc] mr-2 shrink-0 border border-[#e5e5e5] px-1.5 py-0.5">
            ⌘K
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 max-h-[420px] overflow-y-auto">
          <div className="flex border-b border-[#e5e5e5] px-1 py-1 gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f.key ? "bg-black text-white" : "text-[#999] hover:text-black"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="p-4 text-center">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          )}

          {!loading && !hasResults && query.length > 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-[#999]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div>
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#999]">People</div>
              {users.map((u) => (
                <Link
                  key={u.id}
                  href={`/u/${u.username}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] transition-colors"
                >
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {u.name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{u.name || u.username}</p>
                    <p className="text-xs text-[#999] font-mono">@{u.username}</p>
                  </div>
                  <span className="text-xs text-[#999] shrink-0">{u._count.followers} followers</span>
                </Link>
              ))}
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div>
              {users.length > 0 && <div className="border-t border-[#e5e5e5]" />}
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#999]">Projects</div>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] transition-colors"
                >
                  {p.imageUrl ? (
                    <div className="w-8 h-8 shrink-0 overflow-hidden bg-[#f5f5f5]">
                      <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#f5f5f5] shrink-0 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-[#999]">
                      {p.category} &middot; by {p.user.name || `@${p.user.username}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
