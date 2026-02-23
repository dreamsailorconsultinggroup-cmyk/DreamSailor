"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronRight,
  GraduationCap,
  Briefcase,
  FileText,
  Plus,
  List,
  ArrowLeftCircle,
  Home
} from "lucide-react"


interface SidebarItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Education",
    icon: GraduationCap,
    children: [{ title: "Edu Applicants", icon: List, href: "/admin/education" }],
  },
  {
    title: "Job & Recruitment",
    icon: Briefcase,
    children: [
      { title: "Job Sector", icon: Plus, href: "/admin/add-job-sector" },
      { title: "Job Post", icon: FileText, href: "/admin/add-job-post" },
      { title: "Job Applications", icon: List, href: "/admin/job-applications" },
    ],
  },
  {
    title: "Blog",
    icon: FileText,
    children: [
      { title: "All Posts", icon: List, href: "/admin/blog-posts" },
      { title: "Add Post", icon: Plus, href: "/admin/add-blog-post" },
    ],
  },
   {
    title: "Business and Events",
    icon: FileText,
    children: [
      { title: "Inquiries", icon: List, href: "/admin/businessEventsView" },
    ],
  },
  {
    title: "Lands and Homes",
    icon: Home,
    children: [
      { title: "Add Home", icon: Plus, href: "/admin/businessEventsView" },
    ],
  }
]

interface SidebarMenuItemProps {
  item: SidebarItem
  isExpanded: boolean
}

function SidebarMenuItem({ item, isExpanded }: SidebarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.href ? pathname === item.href : false
  const hasActiveChild = item.children?.some(child => child.href && pathname === child.href)

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    } else if (item.href) {
      router.push(item.href)
    }
  }

  const handleChildClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="space-y-1">
      {/* Main Menu Item */}
      <div className="relative">
        <Button
          variant={isActive || hasActiveChild ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-10 px-3",
            isActive && "bg-secondary text-secondary-foreground",
            hasActiveChild && "bg-secondary/50"
          )}
          onClick={handleClick}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {isExpanded && (
            <>
              <span className="truncate">{item.title}</span>
            </>
          )}
        </Button>
      </div>

      {/* Sub Menu Items */}
      {hasChildren && isOpen && isExpanded && (
        <div className="ml-4 space-y-1 border-l border-border pl-4">
          {item.children?.map((child, index) => (
            <Button
              key={index}
              variant={pathname === child.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-9 px-3 text-sm",
                pathname === child.href && "bg-secondary text-secondary-foreground"
              )}
              onClick={() => child.href && handleChildClick(child.href)}
            >
              <child.icon className="h-3 w-3 shrink-0" />
              <span className="truncate">{child.title}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

interface AdminSidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function AdminSidebar({ isExpanded, onToggle }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear token and credentials
    sessionStorage.removeItem("auth-token") // Use sessionStorage only
    router.push("/") // Navigate to the home page
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300 h-screen",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">DS</span>
          </div>
          {isExpanded && (
            <span className="font-semibold text-foreground">DreamSailor Admin</span>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-2 px-3">
          {sidebarItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggle}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full mt-2 transition-all duration-300",
            isExpanded ? "justify-start px-3" : "justify-center"
          )}
          onClick={handleLogout}
        >
          <ArrowLeftCircle className="h-4 w-4 shrink-0" />
          {isExpanded && <span className="truncate ml-2">Back to Website</span>}
        </Button>
      </div>
    </div>
  )
}