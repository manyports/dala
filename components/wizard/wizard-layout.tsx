"use client"

import { useWizardStore } from "@/lib/store/wizard-store"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/app/components"

interface WizardLayoutProps {
  children: React.ReactNode
  totalSteps: number
}

export function WizardLayout({ children, totalSteps }: WizardLayoutProps) {
  const { currentStep } = useWizardStore()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="border-b border-[#e5e5e5]">
        <div className="max-w-[600px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-[#666] font-mono">Step {currentStep} of {totalSteps}</p>
          <div className="flex-1 ml-4 h-1 bg-[#eee]">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-10 md:py-12">
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-black py-4">
        <div className="max-w-[600px] mx-auto px-4 md:px-6">
          <p className="text-xs text-[#666]">
            You can edit, hide, or delete your project after launch.
          </p>
        </div>
      </footer>
    </div>
  )
}
