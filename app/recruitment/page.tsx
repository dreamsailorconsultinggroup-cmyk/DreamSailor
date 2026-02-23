import { Header } from "@/components/header"
import { RecruitmentSection } from "@/components/recruitment-section"
import { Footer } from "@/components/footer"

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RecruitmentSection />
      </main>
      <Footer />
    </div>
  )
}