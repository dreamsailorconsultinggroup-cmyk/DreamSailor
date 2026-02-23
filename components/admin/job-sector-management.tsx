"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  RefreshCw,
  PlusCircle,
  Trash2, 
  Eye,
  Briefcase,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useJobSectorService } from "@/lib/jobSectorService"
import { useToast } from "@/hooks/use-toast"

interface JobSector {
  jobSectorId: string
  jobSectorName: string
}

export default function JobSectorManagementComponent() {
  const { addJobSector, getJobSectors, getJobSectorById, deleteJobSector, token } = useJobSectorService()
  const { toast } = useToast()
  
  // State management
  const [jobSectors, setJobSectors] = useState<JobSector[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [jobSectorName, setJobSectorName] = useState("")
  const [selectedSector, setSelectedSector] = useState<JobSector | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [sectorToDelete, setSectorToDelete] = useState<JobSector | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Fetch job sectors from backend
  const fetchJobSectors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!token) {
        setError("No authentication token available. Please log in first.")
        return
      }

      const result = await getJobSectors()
      setJobSectors(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Error fetching job sectors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchJobSectors()
  }, [token])

  // Handle adding new job sector
  const handleAddJobSector = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobSectorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a job sector name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await addJobSector(jobSectorName.trim())
      
      toast({
        title: "Success",
        description: result.successMessage || "Job sector added successfully",
      })
      setJobSectorName("")
      setShowAddForm(false)
      await fetchJobSectors() // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add job sector",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle viewing sector details
  const handleViewSector = (sector: JobSector) => {
    setSelectedSector(sector)
    setShowViewDialog(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (sector: JobSector) => {
    setSectorToDelete(sector)
    setShowDeleteDialog(true)
  }

  // Handle actual deletion
  const handleDelete = async () => {
    if (!sectorToDelete) return
    
    try {
      const result = await deleteJobSector(sectorToDelete.jobSectorId)
      
      toast({
        title: "Success",
        description: result.successMessage || "Job sector deleted successfully",
      })
      
      await fetchJobSectors() // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete job sector",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSectorToDelete(null)
    }
  }

  // Filter job sectors based on search term
  const filteredSectors = jobSectors.filter(sector =>
    sector.jobSectorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading job sectors...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error loading job sectors</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={fetchJobSectors} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Sector Management</h1>
          <p className="text-muted-foreground">Manage and organize job sectors</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Job Sector
        </Button>
      </div>

      {/* Add Job Sector Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add New Job Sector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddJobSector} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobSectorName">Job Sector Name</Label>
                <Input
                  id="jobSectorName"
                  type="text"
                  value={jobSectorName}
                  onChange={(e) => setJobSectorName(e.target.value)}
                  placeholder="Enter job sector name"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Adding..." : "Add Sector"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setJobSectorName("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sectors</p>
                <p className="text-2xl font-bold">{jobSectors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredSectors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search job sectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={fetchJobSectors}
              variant="outline"
              size="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Sectors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Sectors ({filteredSectors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSectors.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? "No sectors found" : "No job sectors available"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm 
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first job sector"
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Job Sector
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sector Name</TableHead>
                  <TableHead>Sector ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSectors.map((sector) => (
                  <TableRow key={sector.jobSectorId}>
                    <TableCell className="font-medium">
                      {sector.jobSectorName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {sector.jobSectorId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSector(sector)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConfirm(sector)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Sector Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Sector Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this job sector
            </DialogDescription>
          </DialogHeader>
          {selectedSector && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sector Name</Label>
                  <p className="text-sm font-medium">{selectedSector.jobSectorName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sector ID</Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedSector.jobSectorId}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the job sector "{sectorToDelete?.jobSectorName}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}