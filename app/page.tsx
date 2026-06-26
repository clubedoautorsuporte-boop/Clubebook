import { auth } from '@/auth'
import { CtaProvider } from '@/components/landing/cta-context'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { FeatureStrip } from '@/components/landing/feature-strip'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Solutions } from '@/components/landing/solutions'
import { StatsBand } from '@/components/landing/stats-band'
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
        <FeatureStrip />
        <HowItWorks />
        <Solutions />
        <StatsBand />
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
