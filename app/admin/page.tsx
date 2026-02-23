"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to education page by default
    router.push("/admin/education")
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-lg">Redirecting to admin panel...</div>
      </div>
    </div>
  )
}