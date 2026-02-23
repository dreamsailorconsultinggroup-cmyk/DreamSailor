"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  RefreshCw,
  PlusCircle,
  Trash2,
  Eye,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  User,
} from "lucide-react";
import {
  useJobPostService,
  AddJobPostDto,
  ViewJobPostDto,
  JobTypeEnum,
  JobPostFilterDto,
  PaginatedList,
  getJobTypeLabel,
  getJobTypeOptions,
} from "@/lib/jobPostService";
import { useJobSectorService } from "@/lib/jobSectorService";
import { useToast } from "@/hooks/use-toast";

export default function JobPostManagementComponent() {
  const { addJobPost, getJobPostsAdmin, getJobPostById, deleteJobPost, token } =
    useJobPostService();
  const { getJobSectors } = useJobSectorService();
  const { toast } = useToast();

  // State management
  const [jobPosts, setJobPosts] = useState<PaginatedList<ViewJobPostDto>>({
    items: [],
    currentPageNum: 1,
    totalPages: 0,
    totalCount: 0,
    pageTotal: 0,
    prevPageNum: 1,
    nextPageNum: 1,
    hasPrevious: false,
    hasNextPage: false,
  });
  const [jobSectors, setJobSectors] = useState<
    Array<{ jobSectorId: string; jobSectorName: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobPost, setSelectedJobPost] = useState<ViewJobPostDto | null>(
    null
  );
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobPostToDelete, setJobPostToDelete] = useState<ViewJobPostDto | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterJobSectorId, setFilterJobSectorId] = useState<string>("all");
  const [filterJobType, setFilterJobType] = useState<JobTypeEnum | "all">(
    "all"
  );

  // Form states
  const [formData, setFormData] = useState<AddJobPostDto>({
    jobTitle: "",
    jobCompanyTitle: "",
    jobSalary: "",
    jobSectorId: "none",
    jobType: JobTypeEnum.Full_Time,
    jobDescription: "",
    jobResponsibility: "", // Note: typo matches backend
    jobQualification: "",
    jobLocation: "",
  });

  // Fetch job sectors for dropdown
  const fetchJobSectors = async () => {
    try {
      // Remove token check since the service handles authentication
      const result = await getJobSectors();
      setJobSectors(result.data || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching job sectors:", err);
      setError(
        err instanceof Error ? err.message : "Error loading job sectors"
      );
    }
  };

  // Fetch job posts from backend
  const fetchJobPosts = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);

      const filterDto: JobPostFilterDto = {
        pageNumber: page,
        pageSize: pageSize,
        ...(filterJobSectorId &&
          filterJobSectorId !== "all" && { jobSectorId: filterJobSectorId }),
        ...(filterJobType &&
          filterJobType !== "all" && { jobType: filterJobType as JobTypeEnum }),
      };

      const result = await getJobPostsAdmin(filterDto);

      setJobPosts(
        result.data || {
          items: [],
          currentPageNum: 1,
          totalPages: 0,
          totalCount: 0,
          pageTotal: 0,
          prevPageNum: 1,
          nextPageNum: 1,
          hasPrevious: false,
          hasNextPage: false,
        }
      );

      // If no items but filters are applied, show a toast notification
      if (
        result.data?.items.length === 0 &&
        (filterJobSectorId !== "all" || filterJobType !== "all")
      ) {
        toast({
          title: "No results found",
          description: "No job posts match your selected filters",
          variant: "default",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching job posts:", err);

      // Special handling for common error messages
      if (errorMessage.includes("404")) {
        toast({
          title: "No Job Posts Found",
          description:
            "No job posts match your selected filters. Try a different filter.",
          variant: "default",
        });
        // Reset the filters
        setFilterJobSectorId("all");
        setFilterJobType("all");
      } else {
        setError(errorMessage);
        toast({
          title: "Error fetching job posts",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchJobSectors();
    fetchJobPosts();
  }, [token]);

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchJobPosts();
  }, [currentPage, pageSize, filterJobSectorId, filterJobType]);

  // Handle form input changes
  const handleInputChange = (field: keyof AddJobPostDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle adding new job post
  const handleAddJobPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.jobTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Job title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Job description is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobResponsibility.trim()) {
      toast({
        title: "Validation Error",
        description: "Job responsibility is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobQualification.trim()) {
      toast({
        title: "Validation Error",
        description: "Job qualification is required",
        variant: "destructive",
      });
      return;
    }

    // Check string length limits
    if (formData.jobDescription.length > 1500) {
      toast({
        title: "Validation Error",
        description: "Job description must be less than 1500 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.jobResponsibility.length > 1500) {
      toast({
        title: "Validation Error",
        description: "Job responsibility must be less than 1500 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.jobQualification.length > 1500) {
      toast({
        title: "Validation Error",
        description: "Job qualification must be less than 1500 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const submitData: AddJobPostDto = {
        ...formData,
        jobSectorId:
          formData.jobSectorId === "none" ? undefined : formData.jobSectorId,
        jobSalary: formData.jobSalary || "",
      };

      const result = await addJobPost(submitData);

      toast({
        title: "Success",
        description: result.successMessage || "Job post added successfully",
      });

      // Reset form
      setFormData({
        jobTitle: "",
        jobCompanyTitle: "",
        jobSalary: "",
        jobSectorId: "",
        jobType: JobTypeEnum.Full_Time,
        jobDescription: "",
        jobResponsibility: "",
        jobQualification: "",
        jobLocation: "",
      });
      setShowAddForm(false);
      await fetchJobPosts(); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to add job post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle viewing job post details
  const handleViewJobPost = async (jobPost: ViewJobPostDto) => {
    try {
      const result = await getJobPostById(jobPost.postId);
      setSelectedJobPost(result.data || jobPost);
      setShowViewDialog(true);
    } catch (err) {
      setSelectedJobPost(jobPost);
      setShowViewDialog(true);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (jobPost: ViewJobPostDto) => {
    setJobPostToDelete(jobPost);
    setShowDeleteDialog(true);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    if (!jobPostToDelete) return;

    try {
      const result = await deleteJobPost(jobPostToDelete.postId);

      toast({
        title: "Success",
        description: result.successMessage || "Job post deleted successfully",
      });

      await fetchJobPosts(); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete job post",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setJobPostToDelete(null);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format salary display
  const formatSalary = (salary?: number) => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  // Get job sector name by ID
  const getJobSectorName = (sectorId?: string) => {
    if (!sectorId || sectorId === "none") return "Not specified";
    const sector = jobSectors.find((s) => s.jobSectorId === sectorId);
    return sector ? sector.jobSectorName : "Unknown";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading job posts...</span>
        </div>
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
              <span className="font-medium">Error loading job posts</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => fetchJobPosts()}
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
            Job Post Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage job postings
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Job Post
        </Button>
      </div>

      {/* Add Job Post Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add New Job Post
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleAddJobPost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    placeholder="Enter job title"
                    required
                  />
                </div>

                {/* Company Title */}
                <div className="space-y-2">
                  <Label htmlFor="jobCompanyTitle">Company Title</Label>
                  <Input
                    id="jobCompanyTitle"
                    type="text"
                    value={formData.jobCompanyTitle}
                    onChange={(e) =>
                      handleInputChange("jobCompanyTitle", e.target.value)
                    }
                    placeholder="Enter company title"
                  />
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="jobSalary">Salary</Label>
                  <Input
                    id="jobSalary"
                    type="text"
                    value={formData.jobSalary || ""}
                    onChange={(e) =>
                      handleInputChange("jobSalary", e.target.value)
                    }
                    placeholder="Enter salary"
                  />
                </div>

                {/* ⭐ NEW: Job Location */}
                <div className="space-y-2">
                  <Label htmlFor="jobLocation">Job Location *</Label>
                  <Input
                    id="jobLocation"
                    type="text"
                    value={formData.jobLocation}
                    onChange={(e) =>
                      handleInputChange("jobLocation", e.target.value)
                    }
                    placeholder="Enter job location (e.g., Kathmandu, Remote)"
                    required
                  />
                </div>

                {/* Job Sector */}
                <div className="space-y-2">
                  <Label htmlFor="jobSectorId">Job Sector</Label>
                  <Select
                    value={formData.jobSectorId}
                    onValueChange={(value) =>
                      handleInputChange("jobSectorId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific sector</SelectItem>
                      {jobSectors.map((sector) => (
                        <SelectItem
                          key={sector.jobSectorId}
                          value={sector.jobSectorId}
                        >
                          {sector.jobSectorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select
                    value={formData.jobType.toString()}
                    onValueChange={(value) =>
                      handleInputChange("jobType", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getJobTypeOptions().map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description, Responsibility, Qualification */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Description *</Label>
                  <Textarea
                    value={formData.jobDescription}
                    onChange={(e) =>
                      handleInputChange("jobDescription", e.target.value)
                    }
                    required
                    maxLength={1500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.jobDescription.length}/1500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Job Responsibility *</Label>
                  <Textarea
                    value={formData.jobResponsibility}
                    onChange={(e) =>
                      handleInputChange("jobResponsibility", e.target.value)
                    }
                    required
                    maxLength={1500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.jobResponsibility.length}/1500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Job Qualification *</Label>
                  <Textarea
                    value={formData.jobQualification}
                    onChange={(e) =>
                      handleInputChange("jobQualification", e.target.value)
                    }
                    required
                    maxLength={1500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.jobQualification.length}/1500 characters
                  </p>
                </div>
              </div>

              {/* Buttons */}
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
                  {isSubmitting ? "Adding..." : "Add Job Post"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      jobTitle: "",
                      jobCompanyTitle: "",
                      jobSalary: "",
                      jobSectorId: "none",
                      jobType: JobTypeEnum.Full_Time,
                      jobDescription: "",
                      jobResponsibility: "",
                      jobQualification: "",
                      jobLocation: "",
                    });
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
                <p className="text-sm font-medium text-muted-foreground">
                  Total Job Posts
                </p>
                <p className="text-2xl font-bold">{jobPosts.totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Page
                </p>
                <p className="text-2xl font-bold">{jobPosts.currentPageNum}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </p>
                <p className="text-2xl font-bold">{jobPosts.totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Posts ({jobPosts.totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="filterJobSector">Filter by Job Sector</Label>
              <Select
                value={filterJobSectorId}
                onValueChange={setFilterJobSectorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  {jobSectors.map((sector) => (
                    <SelectItem
                      key={sector.jobSectorId}
                      value={sector.jobSectorId}
                    >
                      {sector.jobSectorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filterJobType">Filter by Job Type</Label>
              <Select
                value={filterJobType.toString()}
                onValueChange={(value) =>
                  setFilterJobType(
                    value === "all" ? "all" : (Number(value) as JobTypeEnum)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {getJobTypeOptions().map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => fetchJobPosts()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Job Posts Cards */}
          {jobPosts.items.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No job posts found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first job post
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Job Post
              </Button>
            </div>
          ) : (
            <>
              {/* Job Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobPosts.items.map((jobPost) => (
                  <Card
                    key={jobPost.postId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground mb-2">
                            {jobPost.jobTitle}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {getJobTypeLabel(jobPost.jobType)}
                            </Badge>
                            {jobPost.salary && (
                              <Badge variant="secondary" className="text-xs">
                                {formatSalary(jobPost.salary)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Company:
                            </span>
                            <span className="font-medium">
                              {jobPost.companyTitle || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Sector:
                            </span>
                            <span className="font-medium">
                              {jobPost.jobSector}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">
                            Description:
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {jobPost.jobDescription.length > 150
                              ? `${jobPost.jobDescription.substring(0, 150)}...`
                              : jobPost.jobDescription}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                          <div className="text-xs text-muted-foreground">
                            Post ID: {jobPost.postId.substring(0, 8)}...
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJobPost(jobPost)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteConfirm(jobPost)}
                              className="text-destructive hover:text-destructive flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {jobPosts.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(jobPosts.currentPageNum - 1) * pageSize + 1} to{" "}
                    {Math.min(
                      jobPosts.currentPageNum * pageSize,
                      jobPosts.totalCount
                    )}{" "}
                    of {jobPosts.totalCount} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={!jobPosts.hasPrevious}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(jobPosts.prevPageNum)}
                      disabled={!jobPosts.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {jobPosts.currentPageNum} of {jobPosts.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(jobPosts.nextPageNum)}
                      disabled={!jobPosts.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(jobPosts.totalPages)}
                      disabled={!jobPosts.hasNextPage}
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

      {/* View Job Post Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-6 w-6" />
              Job Post Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this job posting
            </DialogDescription>
          </DialogHeader>
          {selectedJobPost && (
            <div className="space-y-8">
              {/* Header Information */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {selectedJobPost.jobTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company
                    </Label>
                    <p className="text-base font-medium">
                      {selectedJobPost.companyTitle || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Salary
                    </Label>
                    <p className="text-base font-medium">
                      {formatSalary(selectedJobPost.salary)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Type
                    </Label>
                    <Badge variant="outline" className="text-sm">
                      {getJobTypeLabel(selectedJobPost.jobType)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Sector
                    </Label>
                    <p className="text-base">{selectedJobPost.jobSector}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Post ID
                    </Label>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedJobPost.postId}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 gap-8">
                {/* Job Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Job Description
                    </h3>
                  </div>
                  <div className="bg-background border rounded-lg p-6">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                      {selectedJobPost.jobDescription}
                    </p>
                  </div>
                </div>

                {/* Job Responsibilities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Key Responsibilities
                    </h3>
                  </div>
                  <div className="bg-background border rounded-lg p-6">
                    <div className="text-foreground leading-relaxed text-base">
                      {selectedJobPost.jobResponsibility
                        .split("\n")
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 mb-3 last:mb-0"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{item.trim()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Job Qualifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Required Qualifications
                    </h3>
                  </div>
                  <div className="bg-background border rounded-lg p-6">
                    <div className="text-foreground leading-relaxed text-base">
                      {selectedJobPost.jobQualification
                        .split("\n")
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 mb-3 last:mb-0"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{item.trim()}</span>
                          </div>
                        ))}
                    </div>
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
                    handleDeleteConfirm(selectedJobPost);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Job Post
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
              Are you sure you want to delete the job post "
              {jobPostToDelete?.jobTitle}"? This action cannot be undone.
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
