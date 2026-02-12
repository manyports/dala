"use client"

import { motion } from "framer-motion"
import { 
  Navigation, 
  Hero, 
  LiveFeed,
  Stats, 
  WhyDifferent,
  FeaturedProjects, 
  Impact,
  FinalCTA,
  Footer 
} from "./components"
import { featuredProjects } from "./data/projects"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="overflow-hidden">
        <Hero />
        <LiveFeed />
        <Stats />
        <WhyDifferent />
        
        <section className="py-20 md:py-32 border-b border-black">
          <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Projects people are funding right now
              </h2>
              <p className="text-lg text-[#666]">
                Real creators, real products, real deadlines.
              </p>
            </motion.div>
            <FeaturedProjects projects={featuredProjects.slice(0, 3)} />
          </div>
        </section>

        <Impact />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
