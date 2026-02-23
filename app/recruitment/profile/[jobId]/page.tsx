"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, DollarSign, Briefcase, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useJobPostService, ViewJobPostDto } from "@/lib/jobPostService";
import { useInView } from "@/hooks/use-in-view";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { url } from "inspector";

interface JobData {
  postId: string;
  jobTitle: string;
  companyTitle: string;
  jobLocation: string;
  jobType: string | number;
  jobDescription: string;
  jobResponsibility?: string;
  jobQualification?: string;
  salary: string | number;
  createdAt: string;
  country?: string;
  url?: string;
}

const JobProfile = () => {
  const params = useSearchParams();
  const jobParam = params.get("job");
  const { jobId } = useParams();
  const { getJobPostById } = useJobPostService();

  const [job, setJob] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Move useInView to top level to ensure consistent hook calls
  const { ref: jobDetailsRef, isVisible: isJobDetailsVisible } =
    useInView<HTMLDivElement>({ threshold: 0.1 });

  const getJobTypeLabel = (jobType: string | number): string => {
    if (typeof jobType === "string") return jobType;
    const types: { [key: number]: string } = {
      1: "Full Time",
      2: "Part Time",
      3: "Hybrid",
      4: "Remote",
    };
    return types[jobType] || "Full Time";
  };

  const formatSalary = (salary: string | number): string => {
    if (typeof salary === "string") return salary;
    if (!salary) return "Competitive";
    return `$${salary.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const fetchJob = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const id = Array.isArray(jobId) ? jobId[0] : jobId;
      const res = await getJobPostById(id);

      if (res.success && res.data) {
        const apiData = res.data;
        setJob({
          postId: apiData.postId,
          jobTitle: apiData.jobTitle,
          companyTitle: apiData.companyTitle,
          jobLocation: apiData.jobLocation || "Not specified",
          jobType: apiData.jobType,
          jobDescription: apiData.jobDescription,
          jobResponsibility: apiData.jobResponsibility,
          jobQualification: apiData.jobQualification,
          salary: apiData.salary || "Competitive",
          createdAt: apiData.createdAt,
          country: apiData.country,
          url: apiData.url || "",
        });
      } else {
        setError("Failed to load job details");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("An error occurred while loading job details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobParam) {
      try {
        const parsedJob = JSON.parse(jobParam);
        setJob({
          postId: parsedJob.PostId || parsedJob.postId,
          jobTitle: parsedJob.JobTitle || parsedJob.jobTitle,
          companyTitle: parsedJob.CompanyTitle || parsedJob.companyTitle,
          jobLocation:
            parsedJob.JobLocation || parsedJob.jobLocation || "Not specified",
          jobType: parsedJob.JobType || parsedJob.jobType,
          jobDescription: parsedJob.JobDescription || parsedJob.jobDescription,
          jobResponsibility:
            parsedJob.JobResponsibility || parsedJob.jobResponsibility,
          jobQualification:
            parsedJob.JobQualification || parsedJob.jobQualification,
          salary: parsedJob.Salary || parsedJob.salary || "Competitive",
          createdAt: parsedJob.CreatedAt || parsedJob.createdAt,
          country: parsedJob.Country || parsedJob.country,
          url: parsedJob.Url || parsedJob.url || "",
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing job param:", err);
        fetchJob();
      }
    } else if (jobId) {
      fetchJob();
    } else {
      setError("No job ID provided");
      setIsLoading(false);
    }
  }, [jobId, jobParam]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center py-12 animate-fade-in">
          <p className="text-lg text-muted-foreground">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center py-12 animate-fade-in">
          <p className="text-lg text-destructive mb-4">
            {error || "Job not found"}
          </p>
          <Link href="/recruitment">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 animate-pulse-slow">
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen font-sans">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 animate-scale-in">
            <img
              src="/Recruitment_and_Place_Hero.jpg"
              alt="Recruitment office"
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-primary/70 animate-fade-in"></div>
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 text-balance animate-fade-in">
              {job.jobTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-100">
              {job.companyTitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-150">
              <Link
                href={`/recruitment/apply?jobId=${
                  job.postId
                }&jobUrl=${encodeURIComponent(job.url || "")}`}
              >
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-3 animate-pulse-slow"
                >
                  Apply Now
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary/10 hover:bg-accent text-white text-lg px-8 py-3 animate-pulse-slow"
                >
                  Enquire
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Job Details */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={jobDetailsRef}
              className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
                isJobDetailsVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle
                      className={`text-2xl font-bold text-primary ${
                        isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                      }`}
                    >
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`flex items-center text-sm text-muted-foreground ${
                        isJobDetailsVisible ? "animate-scale-in" : "opacity-0"
                      }`}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Location:</strong> {job.jobLocation}
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-sm text-muted-foreground ${
                        isJobDetailsVisible ? "animate-scale-in" : "opacity-0"
                      }`}
                    >
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Salary:</strong> {formatSalary(job.salary)}
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-sm text-muted-foreground ${
                        isJobDetailsVisible ? "animate-scale-in" : "opacity-0"
                      }`}
                    >
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Type:</strong> {getJobTypeLabel(job.jobType)}
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-sm text-muted-foreground ${
                        isJobDetailsVisible ? "animate-scale-in" : "opacity-0"
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Posted:</strong> {job.createdAt}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle
                      className={`text-2xl font-bold text-primary ${
                        isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                      }`}
                    >
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`prose max-w-none text-muted-foreground ${
                        isJobDetailsVisible
                          ? "animate-fade-in delay-100"
                          : "opacity-0"
                      }`}
                      dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                    />
                  </CardContent>
                </Card>

                {job.jobResponsibility && (
                  <Card className="bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <CardTitle
                        className={`text-2xl font-bold text-primary ${
                          isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                        }`}
                      >
                        Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`prose max-w-none text-muted-foreground ${
                          isJobDetailsVisible
                            ? "animate-fade-in delay-100"
                            : "opacity-0"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: job.jobResponsibility,
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {job.jobQualification && (
                  <Card className="bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <CardTitle
                        className={`text-2xl font-bold text-primary ${
                          isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                        }`}
                      >
                        Qualifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`prose max-w-none text-muted-foreground ${
                          isJobDetailsVisible
                            ? "animate-fade-in delay-100"
                            : "opacity-0"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: job.jobQualification,
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle
                      className={`text-2xl font-bold text-primary ${
                        isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                      }`}
                    >
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link
                      href={`/recruitment/apply?jobId=${
                        job.postId
                      }&jobUrl=${encodeURIComponent(job.url || "")}`}
                      className="block"
                    >
                      <Button
                        className={`w-full bg-primary hover:bg-blue-900 text-white transition-all ${
                          isJobDetailsVisible
                            ? "animate-pulse-slow"
                            : "opacity-0"
                        }`}
                      >
                        Apply for this Position
                        <FileText className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/contact" className="block">
                      <Button
                        variant="outline"
                        className={`w-full bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all ${
                          isJobDetailsVisible
                            ? "animate-pulse-slow"
                            : "opacity-0"
                        }`}
                      >
                        Contact Recruiter
                      </Button>
                    </Link>
                    <Link href="/recruitment" className="block">
                      <Button
                        variant="outline"
                        className={`w-full bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all ${
                          isJobDetailsVisible
                            ? "animate-pulse-slow"
                            : "opacity-0"
                        }`}
                      >
                        Back to All Jobs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {job.country && (
                  <Card className="mt-4 bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle
                        className={`text-2xl font-bold text-primary ${
                          isJobDetailsVisible ? "animate-fade-in" : "opacity-0"
                        }`}
                      >
                        Location Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`space-y-2 ${
                          isJobDetailsVisible ? "animate-scale-in" : "opacity-0"
                        }`}
                      >
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{job.country}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default JobProfile;
