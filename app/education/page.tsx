import { Header } from "@/components/header"
import { EducationSection } from "@/components/education-section"
import { Footer } from "@/components/footer"

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EducationSection />
      </main>
      <Footer />
    </div>
  )
}