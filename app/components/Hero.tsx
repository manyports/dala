"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function Hero() {
  const { status } = useSession()
  const startHref = status === "authenticated" ? "/dashboard" : "/signup"

  return (
    <section className="relative border-b border-black">
      <div className="px-4 md:px-6 py-20 md:py-32 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2rem,6vw,5rem)] font-bold leading-[1.1] tracking-tight mb-8">
              Let's improve your crowdfunding experience!
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-[#666]">
              We at Dala want to make sure the best products get the awareness they deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div className="space-y-4">
              <div className="text-sm font-mono uppercase tracking-wider text-[#999]">The Problem</div>
              <p className="text-lg leading-relaxed">
                Most crowdfunding platforms take 5-10% of your funding, hide projects behind algorithms, and make it hard for creators to actually ship.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-mono uppercase tracking-wider text-[#999]">Our Solution</div>
              <p className="text-lg leading-relaxed">
                Flat $49/month. No percentage cuts. Milestone-based funding. Every project gets equal visibility. Simple as that.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link href="/browse" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Browse projects
              </Button>
            </Link>
            <Link href={startHref} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Start your project
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
