"use client"

import { motion } from "framer-motion"

export function WhyDifferent() {
  return (
    <section className="py-20 md:py-32 border-b border-black">
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why is this different from Kickstarter?
            </h2>
            <p className="text-xl text-[#666] max-w-2xl">
              Good question. Here&apos;s the honest answer:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="border-l-4 border-black pl-6">
                <div className="text-sm font-mono uppercase tracking-wider text-[#999] mb-2">
                  Them
                </div>
                <ul className="space-y-3 text-lg text-[#666]">
                  <li>• Take 5% + payment fees</li>
                  <li>• Algorithm decides visibility</li>
                  <li>• All-or-nothing funding</li>
                  <li>• No milestone tracking</li>
                  <li>• Limited creator tools</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-black pl-6">
                <div className="text-sm font-mono uppercase tracking-wider text-[#999] mb-2">
                  Us
                </div>
                <ul className="space-y-3 text-lg">
                  <li>• Flat $49/mo, keep 100%</li>
                  <li>• Every project visible equally</li>
                  <li>• Keep funds if you hit minimum</li>
                  <li>• Milestone-based releases</li>
                  <li>• Full creator dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-8 md:p-12">
            <p className="text-xl md:text-2xl leading-relaxed max-w-3xl">
              We built this because we were tired of platforms taking huge cuts from creators who already struggle to fund their work. 
              If you ship, you deserve to keep what you raise.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
