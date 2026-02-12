import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("password123", 12)

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@dala.kz" },
    update: {},
    create: {
      name: "Arman Turarov",
      email: "demo@dala.kz",
      password,
    },
  })

  const backerUser = await prisma.user.upsert({
    where: { email: "backer@dala.kz" },
    update: {},
    create: {
      name: "Dana Mukhamejanova",
      email: "backer@dala.kz",
      password,
    },
  })

  const projects = [
    {
      title: "Modular Synthesizer Kit",
      subtitle: "An open-source analog synth you assemble at home. No soldering required.",
      description:
        "We're building the first fully modular analog synthesizer kit designed for Central Asia's growing electronic music scene.\n\nEvery module snaps together like LEGO. No soldering, no engineering degree. Just sound.\n\nThe kit ships with 8 base modules: oscillator, filter, envelope, LFO, mixer, sequencer, effects, and output. Each one handmade in Almaty from locally sourced components.\n\nWhy this matters: Electronic music production tools are expensive and inaccessible in the CIS region. We're changing that.\n\nTimeline:\n- Month 1-2: Final prototyping\n- Month 3: Production run of 200 units\n- Month 4: Shipping to backers\n\nEvery backer gets access to our online patch library and tutorial videos.",
      category: "technology",
      subcategory: "Hardware",
      country: "KZ",
      currency: "KZT",
      location: "Almaty, Kazakhstan",
      goalAmount: 2500000,
      fundingType: "AON",
      durationDays: 30,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop",
    },
    {
      title: "Grid/System — A Typeface for the Steppe",
      subtitle: "A geometric sans-serif inspired by Kazakh ornamental patterns and Swiss grid systems.",
      description:
        "Grid/System is a typeface that bridges two worlds: the mathematical precision of Swiss typography and the geometric beauty of traditional Kazakh ornament.\n\n12 weights. Full Cyrillic + Latin support. Variable font included.\n\nDesigned over 2 years in Astana, tested across 40+ real-world projects from branding to wayfinding systems.\n\nLicensing: Every backer gets a perpetual desktop + web license. Agency tier includes unlimited seats.\n\nThis is the typeface Central Asian designers have been waiting for.",
      category: "art",
      subcategory: "Digital Art",
      country: "KZ",
      currency: "KZT",
      location: "Astana, Kazakhstan",
      goalAmount: 800000,
      fundingType: "KWYG",
      durationDays: 45,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
    },
    {
      title: "Nomad Coffee Co.",
      subtitle: "Specialty coffee roasted in the Tien Shan foothills. Direct trade, zero waste.",
      description:
        "We source green beans directly from Ethiopian and Colombian farms and roast them at 2,000m altitude in the mountains outside Almaty.\n\nAltitude roasting changes everything — lower air pressure means slower, more even extraction of flavor compounds.\n\nOur first blend, 'Silk Road', is a medium-dark roast with notes of dark chocolate, dried apricot, and black tea.\n\nWe ship in fully compostable packaging made from recycled cotton from Turkestan region.\n\nFunds go toward:\n- Commercial roasting equipment upgrade\n- First 500kg production run\n- Delivery infrastructure across KZ and RU",
      category: "food",
      subcategory: "Beverages",
      country: "KZ",
      currency: "KZT",
      location: "Almaty, Kazakhstan",
      goalAmount: 1500000,
      fundingType: "AON",
      durationDays: 30,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop",
    },
    {
      title: "Indie Film: Aral",
      subtitle: "A documentary about the communities living on the shores of a vanishing sea.",
      description:
        "The Aral Sea was once the 4th largest lake in the world. Now it's a desert.\n\nBut people still live there. Fishermen who remember the water. Children who've never seen it.\n\nThis documentary follows three families across one year as they navigate life on the edge of an ecological catastrophe.\n\nShot on 16mm film. Directed by Nurlan Batyrbekov. Produced in partnership with the Kazakh National Film Archive.\n\nYour pledge helps us complete post-production and secure festival distribution.\n\nWe're not making a sad film. We're making an honest one.",
      category: "art",
      subcategory: "Film",
      country: "KZ",
      currency: "KZT",
      location: "Aralsk, Kazakhstan",
      goalAmount: 5000000,
      fundingType: "AON",
      durationDays: 60,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
    },
    {
      title: "Board Game: Silk Road",
      subtitle: "A strategy board game where you build trade routes across medieval Central Asia.",
      description:
        "2-5 players. 60-90 minutes. Historically accurate.\n\nYou play as a merchant house in the 13th century, building caravansaries, negotiating with local rulers, and navigating the dangers of the steppe.\n\nMechanics: Worker placement + route building + negotiation. Inspired by Brass: Birmingham and Concordia.\n\nComponents: 200+ wooden tokens, illustrated map board, 120 cards, cloth bag.\n\nAll art by Kazakh illustrator Aida Karimova. All historical research reviewed by scholars at Al-Farabi University.\n\nAvailable in Kazakh, Russian, and English.",
      category: "games",
      subcategory: "Board Games",
      country: "KZ",
      currency: "KZT",
      location: "Almaty, Kazakhstan",
      goalAmount: 3000000,
      fundingType: "AON",
      durationDays: 30,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b2e4c20a?w=1200&h=600&fit=crop",
    },
  ]

  for (const projectData of projects) {
    const existing = await prisma.project.findFirst({
      where: { title: projectData.title, userId: demoUser.id },
    })

    if (existing) {
      console.log(`Skipping "${projectData.title}" (already exists)`)
      continue
    }

    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId: demoUser.id,
      },
    })

    const rewardTiers = getRewardsForProject(projectData.title, projectData.currency)
    for (const reward of rewardTiers) {
      await prisma.rewardTier.create({
        data: { ...reward, projectId: project.id },
      })
    }

    const pledgeCount = Math.floor(Math.random() * 40) + 10
    for (let i = 0; i < pledgeCount; i++) {
      const tier = rewardTiers[Math.floor(Math.random() * rewardTiers.length)]
      const extraAmount = Math.floor(Math.random() * 3) * 500
      await prisma.pledge.create({
        data: {
          amount: tier.amount + extraAmount,
          projectId: project.id,
          userId: backerUser.id,
          status: "active",
        },
      })
    }

    console.log(`Created "${projectData.title}" with ${pledgeCount} pledges`)
  }

  console.log("\nSeed complete.")
  console.log("Demo creator: demo@dala.kz / password123")
  console.log("Demo backer:  backer@dala.kz / password123")
}

function getRewardsForProject(title: string, currency: string): Array<{ title: string; description: string; amount: number; shippingType: string; quantityLimit: number | null; itemIds: string[] }> {
  const rewards: Record<string, Array<{ title: string; description: string; amount: number; shippingType: string; quantityLimit: number | null }>> = {
    "Modular Synthesizer Kit": [
      { title: "Digital Supporter", description: "Access to patch library and build tutorials", amount: 2000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Starter Kit (4 modules)", description: "Oscillator, filter, envelope, output — the essentials", amount: 35000, shippingType: "WORLDWIDE", quantityLimit: 100 },
      { title: "Full Kit (8 modules)", description: "The complete modular system with all 8 modules and carry case", amount: 65000, shippingType: "WORLDWIDE", quantityLimit: 50 },
      { title: "Collector's Edition", description: "Full kit + limited wooden enclosure + signed schematic poster", amount: 120000, shippingType: "WORLDWIDE", quantityLimit: 10 },
    ],
    "Grid/System — A Typeface for the Steppe": [
      { title: "Personal License", description: "1 desktop + 1 web license, all 12 weights", amount: 5000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Studio License", description: "Up to 5 seats, desktop + web + app embedding", amount: 15000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Agency License", description: "Unlimited seats + full variable font + specimen book PDF", amount: 45000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Patron", description: "Agency license + printed specimen book + your name in credits", amount: 100000, shippingType: "WORLDWIDE", quantityLimit: 20 },
    ],
    "Nomad Coffee Co.": [
      { title: "Tasting Pack", description: "3x 100g bags of Silk Road blend", amount: 5000, shippingType: "WORLDWIDE", quantityLimit: null },
      { title: "Monthly Supply", description: "1kg bag + branded ceramic mug", amount: 12000, shippingType: "WORLDWIDE", quantityLimit: 200 },
      { title: "Coffee Club (6 months)", description: "Monthly 500g delivery for 6 months + V60 dripper kit", amount: 35000, shippingType: "WORLDWIDE", quantityLimit: 50 },
    ],
    "Indie Film: Aral": [
      { title: "Digital Screening", description: "Early access to the full documentary", amount: 3000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Supporter Pack", description: "Screening + behind-the-scenes footage + poster PDF", amount: 8000, shippingType: "DIGITAL", quantityLimit: null },
      { title: "Producer Credit", description: "Your name in the credits + signed 16mm film strip", amount: 50000, shippingType: "WORLDWIDE", quantityLimit: 25 },
      { title: "Executive Producer", description: "Set visit + private screening + all rewards", amount: 200000, shippingType: "WORLDWIDE", quantityLimit: 5 },
    ],
    "Board Game: Silk Road": [
      { title: "Early Bird", description: "1 copy of the game at a discount", amount: 15000, shippingType: "WORLDWIDE", quantityLimit: 100 },
      { title: "Standard", description: "1 copy of the game", amount: 20000, shippingType: "WORLDWIDE", quantityLimit: null },
      { title: "Deluxe", description: "Metal coins upgrade + art book + game", amount: 35000, shippingType: "WORLDWIDE", quantityLimit: 50 },
      { title: "Merchant Prince", description: "2 copies + playmat + deluxe components + designer signed", amount: 60000, shippingType: "WORLDWIDE", quantityLimit: 15 },
    ],
  }

  return (rewards[title] || []).map((r) => ({ ...r, itemIds: [] }))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
