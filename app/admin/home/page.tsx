"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/authService"
import { 
  Users, 
  Briefcase, 
  Building, 
  Calendar,
  GraduationCap,
  Plane,
  TrendingUp,
  Activity
} from "lucide-react"

export default function AdminHomePage() {
  const { token } = useAuth();
  const router = useRouter()

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  if (!token) {
    return null // Prevent rendering until redirect
  }

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Jobs",
      value: "156",
      icon: Briefcase,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Properties Listed",
      value: "89",
      icon: Building,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Upcoming Events",
      value: "23",
      icon: Calendar,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Course Enrollments",
      value: "567",
      icon: GraduationCap,
      trend: "+18%",
      trendUp: true,
    },
    {
      title: "Visa Applications",
      value: "45",
      icon: Plane,
      trend: "-2%",
      trendUp: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp 
                  className={`h-4 w-4 mr-1 ${
                    stat.trendUp ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
                <span 
                  className={`text-sm font-medium ${
                    stat.trendUp ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">New job application received</p>
                  <p className="text-sm text-muted-foreground">Software Engineer position</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Property listing approved</p>
                  <p className="text-sm text-muted-foreground">3 bedroom apartment in Sydney</p>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">New course enrollment</p>
                  <p className="text-sm text-muted-foreground">Digital Marketing Masterclass</p>
                </div>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Briefcase className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Add Job</p>
                <p className="text-sm text-muted-foreground">Post new position</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Building className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Add Property</p>
                <p className="text-sm text-muted-foreground">List new property</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Create Event</p>
                <p className="text-sm text-muted-foreground">Schedule new event</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <GraduationCap className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Add Course</p>
                <p className="text-sm text-muted-foreground">Create new course</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}