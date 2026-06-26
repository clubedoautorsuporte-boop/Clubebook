import { auth } from '@/auth'
import { CtaProvider } from '@/components/landing/cta-context'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { EbookShowcase } from '@/components/landing/ebook-showcase'
import { FeatureStrip } from '@/components/landing/feature-strip'
import { Solutions } from '@/components/landing/solutions'
import { Comparison } from '@/components/landing/comparison'
import { LeadMagnet } from '@/components/landing/lead-magnet'
import { HowItWorks } from '@/components/landing/how-it-works'
import { TrustStats } from '@/components/landing/trust-stats'
import { Benefits } from '@/components/landing/benefits'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { Faq } from '@/components/landing/faq'
import { FinalCta } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export default async function Page() {
  const session = await auth()

  return (
    <CtaProvider>
      <main className="overflow-x-hidden">
        <Header
          isLoggedIn={!!session}
          userName={session?.user?.name}
          userImage={session?.user?.image}
        />
        <Hero />
        <EbookShowcase />
        <FeatureStrip />
        <Solutions />
        <Comparison />
        <LeadMagnet />
        <HowItWorks />
        <TrustStats />
        <Benefits />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    </CtaProvider>
  )
}
