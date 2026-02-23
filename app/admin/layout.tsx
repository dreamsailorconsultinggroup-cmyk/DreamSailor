"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/AuthProvider"
import { Menu, User, LogOut } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 h-full z-10">
          <AdminSidebar 
            isExpanded={sidebarExpanded} 
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          />
        </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-screen ${sidebarExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-6 bg-muted/30 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}