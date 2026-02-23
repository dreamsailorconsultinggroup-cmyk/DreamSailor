import { Header } from "@/components/header"
import { LandHomesSection } from "@/components/land-homes-section"
import { Footer } from "@/components/footer"

export default function LandHomesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <LandHomesSection />
      </main>
      <Footer />
    </div>
  )
}