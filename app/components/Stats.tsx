"use client"

import { motion } from "framer-motion"

export function Stats() {
  return (
    <section className="py-20 md:py-32 border-b border-black bg-[#fafafa]">
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl">
            Here's how it actually works.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-6xl font-bold font-mono">01</div>
              <h3 className="text-xl font-bold">You create your project</h3>
              <p className="text-[#666] leading-relaxed">
                Tell us what you're making, how much you need, and when you'll deliver. Takes about 15 minutes. We review it in 48 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-6xl font-bold font-mono">02</div>
              <h3 className="text-xl font-bold">People fund you</h3>
              <p className="text-[#666] leading-relaxed">
                Your project goes live. People who believe in it back it. You see the money come in real-time. No hidden fees eating into your funding.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-6xl font-bold font-mono">03</div>
              <h3 className="text-xl font-bold">You ship the product</h3>
              <p className="text-[#666] leading-relaxed">
                Hit your milestones, funds get released. Ship your product to backers. Get rated on delivery. Build your reputation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
