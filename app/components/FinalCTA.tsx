"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function FinalCTA() {
  const { status } = useSession()
  const startHref = status === "authenticated" ? "/dashboard" : "/signup"

  return (
    <section className="py-20 md:py-32 border-t border-black bg-[#fafafa]">
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to launch your project?
            </h2>
            <p className="text-xl text-[#666] leading-relaxed">
              It takes about 15 minutes to get started. We&apos;ll review your project in 48 hours. 
              If approved, you&apos;ll be live and ready to receive funding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div className="bg-white border-2 border-black p-8">
              <div className="text-sm font-mono uppercase tracking-wider mb-4">Cost</div>
              <div className="text-5xl font-bold mb-4">$49/mo</div>
              <p className="text-[#666]">
                That&apos;s it. No percentage fees. No hidden charges. Cancel anytime. 
                Keep 100% of what you raise (minus standard 2.9% payment processing).
              </p>
            </div>

            <div className="bg-white border-2 border-black p-8">
              <div className="text-sm font-mono uppercase tracking-wider mb-4">Success rate</div>
              <div className="text-5xl font-bold mb-4">89%</div>
              <p className="text-[#666]">
                Of projects that launch on Dala hit their funding goal. 
                Most reach it in under 30 days. Real products, real delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link href={startHref} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start your project
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Read the guidelines
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
