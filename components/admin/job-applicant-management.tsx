"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  GraduationCap,
  User,
  AlertCircle,
  Briefcase,
  Building,
  CheckCircle,
} from "lucide-react";
import {
  useJobApplicantService,
  ViewApplicantDto,
  ApplicantFilterDto,
  PaginatedList,
} from "@/lib/jobApplicantService";
import { useJobPostService, ViewJobPostDto } from "@/lib/jobPostService";
import { useToast } from "@/hooks/use-toast";

export default function JobApplicantManagementComponent() {
  const applicantService = useJobApplicantService();
  const { getJobPostsAdmin, getJobPostById } = useJobPostService();
  const { toast } = useToast();

  // State management
  const [applicants, setApplicants] = useState<PaginatedList<ViewApplicantDto>>(
    {
      currentPageNum: 1,
      totalPages: 0,
      totalCount: 0,
      pageTotal: 0,
      items: [],
      prevPageNum: 1,
      nextPageNum: 1,
      hasPrevious: false,
      hasNextPage: false,
    }
  );
  const [jobPosts, setJobPosts] = useState<{ [key: string]: string }>({}); // jobPostId -> jobTitle mapping
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ViewApplicantDto | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [applicantToDelete, setApplicantToDelete] =
    useState<ViewApplicantDto | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch job posts to get job titles
  const fetchJobPosts = async () => {
    try {
      if (!applicantService.token) return;

      const result = await getJobPostsAdmin({ pageNumber: 1, pageSize: 100 }); // Get first 100 job posts
      const jobPostMap: { [key: string]: string } = {};

      if (result.data?.items) {
        result.data.items.forEach((jobPost: ViewJobPostDto) => {
          jobPostMap[jobPost.postId] = jobPost.jobTitle;
        });
      }

      setJobPosts(jobPostMap);
    } catch (err) {
      console.error("Error fetching job posts:", err);
    }
  };

  // Fetch applicants from backend
  const fetchApplicants = async (filters?: ApplicantFilterDto) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!applicantService.token) {
        setError("No authentication token available. Please log in first.");
        return;
      }

      const filterDto: ApplicantFilterDto = {
        pageNumber: currentPage,
        pageSize: pageSize,
        ...filters,
      };

      const result = await applicantService.getAllApplicants(filterDto);
      setApplicants(
        result.data || {
          currentPageNum: 1,
          totalPages: 0,
          totalCount: 0,
          pageTotal: 0,
          items: [],
          prevPageNum: 1,
          nextPageNum: 1,
          hasPrevious: false,
          hasNextPage: false,
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching applicants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (applicantService.token) {
      fetchJobPosts();
      fetchApplicants();
    }
  }, [applicantService.token]);

  // Fetch when pagination changes
  useEffect(() => {
    if (applicantService.token) {
      fetchApplicants();
    }
  }, [currentPage, pageSize, applicantService.token]);

  // Debounced search effect
  useEffect(() => {
    if (!applicantService.token) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchApplicants();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, applicantService.token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewApplicant = async (applicant: ViewApplicantDto) => {
    try {
      // Fetch detailed applicant information
      const detailedApplicant = await applicantService.getApplicantById(
        applicant.applicantId
      );
      setSelectedApplicant(detailedApplicant.data || applicant);
      setShowViewDialog(true);
    } catch (err) {
      setSelectedApplicant(applicant);
      setShowViewDialog(true);
    }
  };

  const handleDeleteConfirm = (applicant: ViewApplicantDto) => {
    setApplicantToDelete(applicant);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!applicantToDelete) return;

    try {
      const result = await applicantService.deleteApplicant(
        applicantToDelete.applicantId
      );

      toast({
        title: "Success",
        description: result.successMessage || "Applicant deleted successfully",
      });

      await fetchApplicants(); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete applicant",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setApplicantToDelete(null);
    }
  };

  const handleDownloadResume = async (
    applicantId: string,
    fileName: string
  ) => {
    try {
      const result = await applicantService.downloadResume(applicantId);

      if (result.data) {
        // Convert base64 to blob and download
        const byteCharacters = atob(result.data.bytes);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Resume downloaded successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get job title by job post ID
  const getJobTitle = (jobPostId: string) => {
    return jobPosts[jobPostId] || "Unknown Job";
  };

  // Filter applicants based on search term
  const filteredApplicants = applicants.items.filter(
    (applicant) =>
      applicant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getJobTitle(applicant.jobPostId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading applicants...</span>
        </div>
      </div>
    );
  }

  // No token state
  if (!applicantService.token) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Authentication Required</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Please log in to access the job applicant management system.
            </p>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error loading applicants</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => fetchApplicants()}
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Job Applicant Management
          </h1>
          <p className="text-muted-foreground">
            Manage and review job applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applicants
                </p>
                <p className="text-2xl font-bold">{applicants.totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold">
                  {filteredApplicants.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Page
                </p>
                <p className="text-2xl font-bold">
                  {applicants.currentPageNum}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </p>
                <p className="text-2xl font-bold">{applicants.totalPages}</p>
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
                  placeholder="Search by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => fetchApplicants()}
                variant="outline"
                size="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Job Applicants ({filteredApplicants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? "No applicants found" : "No applicants available"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Applicants will appear here once people apply for jobs"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Details</TableHead>
                    <TableHead>Job Applied</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.applicantId}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {applicant.fullname}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {applicant.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {applicant.contactNo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {applicant.url == null ? (
                          getJobTitle(applicant.jobPostId)
                        ) : (
                          <a
                            href={applicant.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Visit Jora
                          </a>
                        )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          {applicant.highestEducation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(applicant.appliedDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadResume(
                              applicant.applicantId,
                              applicant.fileName
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplicant(applicant)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteConfirm(applicant)}
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

              {/* Pagination */}
              {applicants.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(applicants.currentPageNum - 1) * pageSize + 1} to{" "}
                    {Math.min(
                      applicants.currentPageNum * pageSize,
                      applicants.totalCount
                    )}{" "}
                    of {applicants.totalCount} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={!applicants.hasPrevious}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(applicants.prevPageNum)}
                      disabled={!applicants.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {applicants.currentPageNum} of{" "}
                      {applicants.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(applicants.nextPageNum)}
                      disabled={!applicants.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(applicants.totalPages)}
                      disabled={!applicants.hasNextPage}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Applicant Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6" />
              Applicant Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this job applicant
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-8">
              {/* Header Information */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {selectedApplicant.fullname}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <p className="text-base">{selectedApplicant.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Number
                      </Label>
                      <p className="text-base">{selectedApplicant.contactNo}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <p className="text-base">{selectedApplicant.address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Applied For
                      </Label>
                      <Badge variant="outline" className="text-sm">
                        {selectedApplicant.url == null ? (
                          getJobTitle(selectedApplicant.jobPostId)
                        ) : (
                          <a
                            href={selectedApplicant.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Visit Jora
                          </a>
                        )}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Highest Education
                      </Label>
                      <p className="text-base">
                        {selectedApplicant.highestEducation}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied Date
                      </Label>
                      <p className="text-base">
                        {formatDate(selectedApplicant.appliedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Resume
                  </h3>
                </div>
                <div className="bg-background border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {selectedApplicant.fileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Resume file
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        handleDownloadResume(
                          selectedApplicant.applicantId,
                          selectedApplicant.fileName
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowViewDialog(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleDeleteConfirm(selectedApplicant);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Applicant
                </Button>
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
              Are you sure you want to delete the application from "
              {applicantToDelete?.fullname}"? This action cannot be undone and
              will permanently remove all applicant data including their resume.
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
  );
}
