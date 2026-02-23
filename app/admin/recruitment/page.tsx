"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Plus, Edit, Trash2, Eye, Loader2, Briefcase } from "lucide-react";
import { 
  JobTypeEnum, 
  useJobPostService, 
  JobPostFilterDto,
  ViewJobPostDto 
} from "@/lib/jobPostService";
import { useJobSectorService } from "@/lib/jobSectorService";

interface JobSector {
  jobSectorId: string;
  jobSectorName: string;
}

interface UseInViewOptions extends IntersectionObserverInit {
  threshold?: number;
}

function useInView(options: UseInViewOptions = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return { ref, isVisible };
}

const isAdmin = (): boolean => {
  return true; // mock permission check
};

export default function AdminJobPostPage() {
  const [showForm, setShowForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompanyTitle, setJobCompanyTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobSectorId, setJobSectorId] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobResponsbility, setJobResponsbility] = useState("");
  const [jobQualification, setJobQualification] = useState("");

  const [jobPosts, setJobPosts] = useState<ViewJobPostDto[]>([]);
  const [jobSectors, setJobSectors] = useState<JobSector[]>([]);
  const [selectedJob, setSelectedJob] = useState<ViewJobPostDto | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { addJobPost, getJobPosts, getJobPostById, deleteJobPost } =
    useJobPostService();
  const { getJobSectors } = useJobSectorService();

  // 🔹 Fetch job posts with filter DTO
  const fetchJobPosts = async () => {
    try {
      const filterDto: JobPostFilterDto = {
        pageNumber: 1,
        pageSize: 100, // Adjust as needed
      };
      
      const response = await getJobPosts(filterDto);
      if (response.success && response.data) {
        setJobPosts(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  // 🔹 Fetch job sectors
  const fetchJobSectors = async () => {
    try {
      const response = await getJobSectors();
      if (response.success && response.data) {
        setJobSectors(response.data);
      }
    } catch (error) {
      console.error("Error fetching job sectors:", error);
    }
  };

  useEffect(() => {
    fetchJobPosts();
    fetchJobSectors();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await addJobPost({
        jobTitle,
        jobCompanyTitle,
        jobLocation,
        jobSalary,
        jobSectorId,
        jobType: JobTypeEnum[jobType as keyof typeof JobTypeEnum],
        jobDescription,
        jobResponsibility: jobResponsbility,
        jobQualification,
      });

      if (response.success) {
        await fetchJobPosts();
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding job post:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setJobTitle("");
    setJobCompanyTitle("");
    setJobLocation("");
    setJobSalary("");
    setJobSectorId("");
    setJobType("");
    setJobDescription("");
    setJobResponsbility("");
    setJobQualification("");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await deleteJobPost(id);
      if (response.success) {
        await fetchJobPosts();
        if (isViewDialogOpen && selectedJob?.postId === id) {
          setIsViewDialogOpen(false);
          setSelectedJob(null);
        }
      }
    } catch (error) {
      console.error("Error deleting job post:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewJob = async (id: string) => {
    setIsLoadingJob(true);
    setIsViewDialogOpen(true);
    try {
      const response = await getJobPostById(id);
      if (response.success && response.data) {
        setSelectedJob(response.data);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoadingJob(false);
    }
  };

  const truncateContent = (text: string, maxLength = 100) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  // Helper to get sector name from ID
  const getSectorName = (sectorId?: string) => {
    if (!sectorId) return "Unknown Sector";
    const sector = jobSectors.find((s) => s.jobSectorId === sectorId);
    return sector ? sector.jobSectorName : "Unknown Sector";
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section id="admin-jobs" className="py-20 bg-muted/30">
          {(() => {
            const { ref, isVisible } = useInView();
            return (
              <div
                ref={ref}
                className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                {/* Header */}
                <div className="text-center mb-16">
                  <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Manage Job Posts
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Create and manage job postings for Dream Sailor Consulting.
                  </p>
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    className="mt-4"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {showForm ? "Cancel" : "Create New Job Post"}
                  </Button>
                </div>

                {/* Job Form */}
                {showForm && (
                  <Card className="max-w-4xl mx-auto mb-12">
                    <CardHeader>
                      <CardTitle>Create a New Job Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Job Title</Label>
                            <Input
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={jobCompanyTitle}
                              onChange={(e) =>
                                setJobCompanyTitle(e.target.value)
                              }
                              placeholder="e.g., Dream Sailor Consulting"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={jobLocation}
                              onChange={(e) => setJobLocation(e.target.value)}
                              placeholder="e.g., Kathmandu"
                            />
                          </div>
                          <div>
                            <Label>Salary</Label>
                            <Input
                              value={jobSalary}
                              onChange={(e) => setJobSalary(e.target.value)}
                              placeholder="e.g., NPR 50,000 - 80,000"
                            />
                          </div>
                        </div>

                        {/* ✅ Job Sector Dropdown */}
                        <div>
                          <Label>Job Sector</Label>
                          <Select
                            value={jobSectorId}
                            onValueChange={setJobSectorId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sector" />
                            </SelectTrigger>
                            <SelectContent>
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

                        <div>
                          <Label>Job Type</Label>
                          <Select value={jobType} onValueChange={setJobType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full_Time">
                                Full Time
                              </SelectItem>
                              <SelectItem value="Part_Time">
                                Part Time
                              </SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>Responsibilities</Label>
                          <Textarea
                            value={jobResponsbility}
                            onChange={(e) =>
                              setJobResponsbility(e.target.value)
                            }
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>Qualifications</Label>
                          <Textarea
                            value={jobQualification}
                            onChange={(e) =>
                              setJobQualification(e.target.value)
                            }
                            rows={4}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isCreating}
                          className="w-full"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Edit className="h-5 w-5 mr-2" />
                              Publish Job Post
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* ✅ Job Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {jobPosts.map((post) => (
                    <Card
                      key={post.postId}
                      className="hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle>{post.jobTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {post.companyTitle} | {post.jobLocation || "N/A"}
                        </p>
                        <p className="text-sm text-primary">
                          {post.salary ? `NPR ${post.salary}` : "Negotiable"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sector: {getSectorName(post.jobSector)}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {truncateContent(post.jobDescription)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewJob(post.postId)}
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(post.postId)}
                            disabled={deletingId === post.postId}
                          >
                            {deletingId === post.postId ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-5 w-5 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ✅ Job Detail Dialog */}
                <Dialog
                  open={isViewDialogOpen}
                  onOpenChange={setIsViewDialogOpen}
                >
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    {isLoadingJob ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : selectedJob ? (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            {selectedJob.jobTitle}
                          </DialogTitle>
                          <DialogDescription>
                            {selectedJob.companyTitle} |{" "}
                            {selectedJob.jobLocation || "N/A"} |{" "}
                            {selectedJob.salary ? `NPR ${selectedJob.salary}` : "Negotiable"}
                            <br />
                            <span className="text-sm text-muted-foreground">
                              Sector: {getSectorName(selectedJob.jobSector)}
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Type</h3>
                            <p>{selectedJob.jobType}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Description
                            </h3>
                            <p className="whitespace-pre-wrap">
                              {selectedJob.jobDescription}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Responsibilities
                            </h3>
                            <p className="whitespace-pre-wrap">
                              {selectedJob.jobResponsibility}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Qualifications
                            </h3>
                            <p className="whitespace-pre-wrap">
                              {selectedJob.jobQualification}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            selectedJob && handleDelete(selectedJob.postId)
                          }
                          disabled={deletingId === selectedJob.postId}
                        >
                          {deletingId === selectedJob.postId ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-5 w-5 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Failed to load job details.
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
}