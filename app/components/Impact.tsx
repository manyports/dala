"use client"

import { motion } from "framer-motion"

export function Impact() {
  return (
    <section className="py-20 md:py-32 border-t border-black">
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Some numbers that matter
            </h2>
            <p className="text-xl text-[#666] max-w-2xl">
              Since we launched in 2019, real creators have raised real money and shipped real products.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">$68M</div>
              <p className="text-[#666]">
                Total funded across all projects. That's money that went directly to creators.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">5,586</div>
              <p className="text-[#666]">
                Projects that actually shipped their product. We track delivery, not just funding.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">89%</div>
              <p className="text-[#666]">
                Success rate for projects that launch. Most platforms don't publish this number.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">28</div>
              <p className="text-[#666]">
                Average days to reach funding goal. Most projects know within a month if they'll make it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">127K</div>
              <p className="text-[#666]">
                People who've backed at least one project. That's a real community, not bots.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-5xl md:text-6xl font-bold">$127</div>
              <p className="text-[#666]">
                Average pledge amount. People back projects they actually believe in.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
