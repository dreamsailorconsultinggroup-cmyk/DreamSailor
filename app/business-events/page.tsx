import { Header } from "@/components/header"
import { BusinessEventsSection } from "@/components/business-events-section"
import { Footer } from "@/components/footer"

export default function BusinessEventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BusinessEventsSection />
      </main>
      <Footer />
    </div>
  )
}