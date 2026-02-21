"use client"

import { Navigation, Footer } from "../components"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HowItWorksPage() {
  const { status } = useSession()
  const startHref = status === "authenticated" ? "/dashboard" : "/signup"

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <div className="px-4 md:px-6 max-w-[1200px] mx-auto py-10 md:py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How it works
          </h1>
          <p className="text-xl text-[#666] mb-16 max-w-2xl">
            You create a project. People fund it. You ship it. That&apos;s the basics. 
            Here&apos;s what actually happens:
          </p>

          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div>
              <h2 className="text-2xl font-bold mb-8">If you&apos;re creating</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="text-sm font-mono mb-2">Step 1</div>
                  <h3 className="text-xl font-bold mb-2">Make your project page</h3>
                  <p className="text-[#666]">
                    Title, description, funding goal, delivery date, images. 
                    Takes about 15 minutes. No payment needed yet.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 2</div>
                  <h3 className="text-xl font-bold mb-2">We check it</h3>
                  <p className="text-[#666]">
                    We verify you&apos;re a real person, your project is feasible, and you&apos;re not scamming anyone. 
                    Usually done in 24-48 hours.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 3</div>
                  <h3 className="text-xl font-bold mb-2">It goes live</h3>
                  <p className="text-[#666]">
                    Your project is now public. You pay $49/month. 
                    Share the link, get backers, watch the funding come in.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 4</div>
                  <h3 className="text-xl font-bold mb-2">You build it</h3>
                  <p className="text-[#666]">
                    Hit milestones, funds get released. Ship the product. 
                    Backers rate you. Good ratings help your next project.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-8">If you&apos;re backing</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="text-sm font-mono mb-2">Step 1</div>
                  <h3 className="text-xl font-bold mb-2">Find something cool</h3>
                  <p className="text-[#666]">
                    Browse projects. Check the creator&apos;s history. 
                    Read the delivery timeline. Decide if you trust them.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 2</div>
                  <h3 className="text-xl font-bold mb-2">Pledge money</h3>
                  <p className="text-[#666]">
                    Choose a reward tier. Enter your card. Money gets held in escrow 
                    (not given to the creator yet).
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 3</div>
                  <h3 className="text-xl font-bold mb-2">Watch it get made</h3>
                  <p className="text-[#666]">
                    Creator posts updates. You can comment and ask questions. 
                    Everything is public, nothing hidden.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-mono mb-2">Step 4</div>
                  <h3 className="text-xl font-bold mb-2">Get your product</h3>
                  <p className="text-[#666]">
                    Product ships to you. You receive it. You rate the experience. 
                    If something&apos;s wrong, support helps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-16">
            <h2 className="text-3xl font-bold mb-8">What makes this different</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="font-bold mb-2">Milestone funding</h3>
                <p className="text-[#666]">
                  Money gets released as creators hit milestones, not all at once. 
                  This protects backers and keeps creators accountable.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">No percentage fees</h3>
                <p className="text-[#666]">
                  Flat $49/month for creators. No 5% cut of your funding. 
                  Raise $10K or $100K, same price.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Public accountability</h3>
                <p className="text-[#666]">
                  All updates, delivery dates, and ratings are public. 
                  You can see exactly who ships and who doesn&apos;t.
                </p>
              </div>
            </div>

            <div className="bg-[#fafafa] p-8 border-2 border-black">
              <p className="text-xl mb-6">
                Most projects on Dala reach their goal in under 30 days. 
                89% of funded projects actually ship their product.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={startHref} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">Start your project</Button>
                </Link>
                <Link href="/browse" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Browse projects</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
