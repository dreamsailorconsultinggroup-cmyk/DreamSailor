import { Header } from "@/components/header"
import { VisaMigrationSection } from "@/components/visa-migration-section"
import { Footer } from "@/components/footer"

export default function VisaMigrationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <VisaMigrationSection />
      </main>
      <Footer />
    </div>
  )
}