"use client"

import { Navigation, Footer } from "../components"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const { status } = useSession()
  const startHref = status === "authenticated" ? "/dashboard" : "/signup"

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <div className="px-4 md:px-6 max-w-[1200px] mx-auto py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What it costs
          </h1>
          <p className="text-xl text-[#666] mb-16 max-w-2xl">
            For creators: $49/month while fundraising. 
            For backers: free. That's it.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="border-2 border-black p-8">
              <div className="text-sm font-mono mb-4">Creators pay</div>
              <div className="text-7xl font-bold mb-4">$49</div>
              <div className="text-xl mb-6">per month</div>
              <p className="text-[#666] mb-6">
                While your project is live and accepting pledges. 
                Cancel anytime. No contracts.
              </p>
              <div className="border-t border-black pt-4 text-sm text-[#666]">
                Plus standard 2.9% + $0.30 payment processing (goes to Stripe, not us)
              </div>
            </div>

            <div className="border-2 border-black p-8 bg-[#fafafa]">
              <div className="text-sm font-mono mb-4">Backers pay</div>
              <div className="text-7xl font-bold mb-4">$0</div>
              <div className="text-xl mb-6">nothing extra</div>
              <p className="text-[#666] mb-6">
                You pay exactly what you pledge. No platform fees, 
                no service charges, no hidden costs.
              </p>
              <div className="border-t border-black pt-4 text-sm text-[#666]">
                If a project doesn't reach its goal, you get refunded automatically
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-16 mb-24">
            <h2 className="text-3xl font-bold mb-12">The math</h2>
            
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start mb-8">
              <div>
                <div className="text-lg font-bold mb-4">On Dala</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">You raise</span>
                    <span className="font-mono">$10,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Platform fee</span>
                    <span className="font-mono">-$49</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Processing</span>
                    <span className="font-mono">-$290</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-black">
                    <span className="font-bold">You keep</span>
                    <span className="font-bold text-xl font-mono">$9,661</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block text-4xl text-[#999] self-center">vs</div>

              <div>
                <div className="text-lg font-bold mb-4">On Kickstarter</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">You raise</span>
                    <span className="font-mono">$10,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Platform fee (5%)</span>
                    <span className="font-mono">-$500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Processing (3-5%)</span>
                    <span className="font-mono">-$400</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-black">
                    <span className="font-bold">You keep</span>
                    <span className="font-bold text-xl font-mono">$9,100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-8">
              <div className="text-3xl font-bold mb-2">Save $561</div>
              <p className="text-[#999]">
                On a $10K project. On a $50K project, you save $2,451. 
                On a $100K project, you save $4,951.
              </p>
            </div>
          </div>

          <div className="border-t-2 border-black pt-16">
            <h2 className="text-3xl font-bold mb-8">Questions people ask</h2>
            
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="font-bold mb-2">When do I start paying the $49?</h3>
                <p className="text-[#666]">
                  When your project goes live. Not when you submit for review. 
                  If we reject it, you pay nothing.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">What if my project takes 6 months?</h3>
                <p className="text-[#666]">
                  You only pay while actively fundraising (usually 30-60 days). 
                  Once your campaign ends, the $49/month stops. Building and shipping is free.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">What if I raise $500,000?</h3>
                <p className="text-[#666]">
                  Still $49/month. We don't take a percentage, period. 
                  Raise $1K or $1M, same price.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Any hidden fees?</h3>
                <p className="text-[#666]">
                  No. Zero. The only costs are $49/month and payment processing. 
                  No listing fees, success fees, withdrawal fees, or any other BS.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Why so much cheaper?</h3>
                <p className="text-[#666]">
                  Because we're not trying to maximize revenue per project. 
                  We'd rather have more creators keeping more of their money.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-[#fafafa] p-8 border-2 border-black">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
                <p className="text-[#666]">No credit card needed until your project is approved.</p>
              </div>
              <Link href={startHref}>
                <Button size="lg" className="whitespace-nowrap">Start your project</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
