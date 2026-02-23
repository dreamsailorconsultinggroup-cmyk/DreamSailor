"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Laptop,
  Stethoscope,
  GraduationCap,
  BarChart,
  Wrench,
  Loader2,
  FileText,
  Search,
  Filter,
  X,
  CheckCircle2,
  Globe,
  TrendingUp,
  Award,
  Target,
  UserCheck,
  Building2,
} from "lucide-react";
import { useBlogService } from "@/lib/blogService";
import BlogSection from "./ui/blog-card-view";
import { useInView } from "@/hooks/use-in-view";
import { useJobPostService } from "@/lib/jobPostService";
import {
  JobPostFilterDto,
  ViewJobPostDto,
  getJobTypeLabel,
} from "@/lib/jobPostService";
import { Input } from "@/components/ui/input";
import ApplicantSection from "./ui/applicant-card-view";

// ------------------- Types -------------------
interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

interface Job {
  PostId: string;
  JobTitle: string;
  CompanyTitle: string;
  JobLocation: string;
  JobType: string;
  JobDescription: string;
  JobResponsibility: string;
  JobQualification: string;
  Salary: string;
  category: string;
  CreatedAt: string;
  urgent: boolean;
  Country: string;
  url?: string;
}

interface Consultant {
  name: string;
  role: string;
  description: string;
  photo: string;
  certificates: string[];
  email: string;
  contactNumber: string;
}

// ------------------- Recruitment Data -------------------
const recruitmentConsultants: Consultant[] = [
  {
    name: "Mr. Puskar Shrestha",
    role: "Co/Founder, Director",
    description:
      "With over 10 years of experience in international recruitment, Mr. Shrestha specializes in technology and healthcare placements globally.",
    photo: "/Pushkar_Shrestha.png",
    certificates: [
      "Certified Recruitment Professional (CRP)",
      "SHRM Certified Professional",
      "Global Talent Acquisition Specialist",
    ],
    email: "recruitment@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
  {
    name: "Mr. Sohil Shrestha",
    role: "International Placement Specialist",
    description:
      "Specializing in visa-sponsored roles and cross-border placements, he helps professionals navigate complex international hiring processes.",
    photo: "/Sohil_Shrestha.png",
    certificates: [
      "International HR Certification",
      "Work Visa Placement Expert",
      "Cross-Cultural Recruitment Specialist",
    ],
    email: "recruitment@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
];

// ------------------- Component -------------------
export function RecruitmentSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [applicants, setApplicants] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [allLocations, setAllLocations] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { getBlogByService } = useBlogService();
  const { getJobPosts, getAllJobLocations } = useJobPostService();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogByService("Recruitment_and_Placement");
      const applicantResponse = await getBlogByService("Applicant");

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        console.error("Failed to fetch data");
      }

      if (applicantResponse.success && applicantResponse.data) {
        setApplicants(applicantResponse.data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllLocations = async () => {
    try {
      const response = await getAllJobLocations();

      if (response.success && response.data) {
        setAllLocations(response.data);
      } else {
        setAllLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setAllLocations([]);
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);

      const filterDto: JobPostFilterDto = {
        pageNumber: currentPage,
        pageSize: pageSize,
      };

      if (debouncedSearchQuery.trim() !== "") {
        filterDto.searchTerm = debouncedSearchQuery.trim();
      }

      if (selectedLocation !== "all") {
        filterDto.Location = selectedLocation;
      }

      const response = await getJobPosts(filterDto);

      const jobsData = response?.data?.items || [];

      if (response?.data) {
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      }

      const formattedJobs: Job[] = jobsData.map((job: ViewJobPostDto) => ({
        PostId: job.postId || `job-${Math.random().toString(36).substr(2, 9)}`,
        JobTitle: job.jobTitle || "Untitled Position",
        CompanyTitle: job.companyTitle || "Company",
        JobLocation: job.jobLocation || "Remote",
        JobType:
          typeof job.jobType === "number"
            ? getJobTypeLabel(job.jobType)
            : job.jobType
              ? String(job.jobType)
              : "Not Specified",
        JobDescription: job.jobDescription || "",
        JobResponsibility: job.jobResponsibility || "",
        JobQualification: job.jobQualification || "",
        Salary: job.salary ? `${job.salary}` : "Competitive",
        category: job.jobSector || "General",
        CreatedAt: job.createdAt,
        urgent: false,
        Country: job.country || job.jobLocation || "Global",
        url: job.url || "",
      }));

      setJobs(formattedJobs);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchAllLocations();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, debouncedSearchQuery, selectedLocation]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedLocation("all");
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchQuery !== "",
    selectedLocation !== "all",
  ].filter(Boolean).length;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-scale-in">
          <img
            src="/Recruitment_and_Place_Hero.jpg"
            alt="Recruitment office"
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60 animate-fade-in"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance animate-fade-in leading-tight">
            Find Your Dream Job & Best Employees{" "}
            <span className="text-secondary block mt-2">All In One Place</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-4 max-w-4xl mx-auto text-pretty animate-fade-in delay-100 font-medium">
            Onshore & Offshore | Full-Time to Part-Time
          </p>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-150 leading-relaxed">
            At Dream Sailor Consulting, we proudly make a difference beyond
            perfection. Our top-tier talents become an integral part of your
            business success story. Whether you're seeking exceptional employees
            or pursuing your dream career, we connect ambition with opportunity
            across borders and industries.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-200">
            <Link href="/book-consultation">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Book a Consultation
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section
        id="recruitment"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-6 tracking-tight flex items-center justify-center">
              <Users className="h-10 w-10 mr-3 text-accent" />
              Recruitment & Placement Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed mb-8">
              At Dream Sailor Consulting, recruitment transcends traditional
              hiring — it's about forging pathways to success. We proudly make a
              difference beyond perfection by connecting skilled professionals
              with organizations that value talent, innovation, and sustainable
              growth. Our comprehensive approach ensures perfect matches for
              both employers seeking exceptional talent and candidates pursuing
              meaningful careers.
            </p>

            {/* Value Proposition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-14 w-14 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2 text-blue-900">
                    Onshore & Offshore
                  </h3>
                  <p className="text-sm text-blue-700">
                    Global reach with local expertise across multiple countries
                    and industries
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6 text-center">
                  <Clock className="h-14 w-14 mx-auto mb-4 text-green-600" />
                  <h3 className="font-bold text-lg mb-2 text-green-900">
                    Flexible Engagement
                  </h3>
                  <p className="text-sm text-green-700">
                    Full-time, part-time, contract, and casual opportunities
                    tailored to your needs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6 text-center">
                  <Award className="h-14 w-14 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-bold text-lg mb-2 text-purple-900">
                    Top-Tier Talent
                  </h3>
                  <p className="text-sm text-purple-700">
                    Pre-screened, qualified professionals ready to drive your
                    business forward
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6 text-center">
                  <Target className="h-14 w-14 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-bold text-lg mb-2 text-orange-900">
                    Beyond Perfection
                  </h3>
                  <p className="text-sm text-orange-700">
                    Making a difference through exceptional service and perfect
                    matches
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Expertise Section */}
          <section className="py-16 mb-16 bg-white rounded-2xl shadow-lg">
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`px-4 sm:px-6 lg:px-8 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                      Our Comprehensive Services
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      End-to-end recruitment solutions designed to meet your
                      unique needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">
                            For Employers
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Talent sourcing and headhunting services
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Comprehensive candidate screening and assessment
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Skills verification and background checks
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Visa sponsorship and work permit assistance
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Onboarding support and integration services
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-xl">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-secondary/10 p-3 rounded-lg">
                            <UserCheck className="h-6 w-6 text-secondary" />
                          </div>
                          <CardTitle className="text-xl">
                            For Job Seekers
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Career counseling and pathway planning
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Resume optimization and interview preparation
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Access to exclusive job opportunities
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Visa application and relocation support
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Salary negotiation and contract review
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Industry Expertise */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-6">
                      Industry Expertise
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                      {[
                        { icon: Laptop, label: "IT & Technology" },
                        { icon: Stethoscope, label: "Healthcare" },
                        { icon: GraduationCap, label: "Education" },
                        { icon: BarChart, label: "Finance" },
                        { icon: Wrench, label: "Engineering" },
                        { icon: Building2, label: "Construction" },
                      ].map((industry, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-all"
                        >
                          <industry.icon className="h-8 w-8 text-primary mb-2" />
                          <p className="text-xs font-medium text-center">
                            {industry.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`px-4 sm:px-6 lg:px-8 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                      Why Choose Dream Sailor Consulting?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We go beyond traditional recruitment to deliver excellence
                      in every placement
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <Globe className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Global Network</h3>
                      <p className="text-sm text-muted-foreground">
                        Access to a vast network of employers and candidates
                        across multiple industries and countries, ensuring
                        perfect matches
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        Certified Expertise
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our team holds international certifications in
                        recruitment, HR, and talent management with proven track
                        records
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Visa Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive visa sponsorship assistance for
                        international placements and smooth relocations
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        Flexible Options
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        From full-time to part-time, contract to permanent — we
                        cover all employment types and arrangements
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Proven Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Over 500 successful placements with a 95% satisfaction
                        rate from both employers and candidates
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                      <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        Fast Turnaround
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Efficient screening process with average placement time
                        of 2-3 weeks for qualified candidates
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Current Opportunities Section */}
          <div id="current-opportunities" className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-4 text-primary flex items-center justify-center">
              <Briefcase className="h-7 w-7 mr-2 text-accent" />
              Current Job Opportunities
            </h3>
            <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
              Browse through our curated job openings across various industries
              and locations. All positions are pre-screened to ensure quality
              opportunities for talented professionals.
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search by job title, company, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white border-2 border-primary/20 focus:border-primary shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Filters and Jobs Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <aside
                className={`lg:w-80 space-y-6 ${
                  showMobileFilters ? "block" : "hidden lg:block"
                }`}
              >
                <Card className="bg-gray-50 border-primary/10 sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                      </span>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Location Filter */}
                    <div>
                      <label className="text-sm font-semibold text-primary mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                      </label>
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {allLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold text-primary mb-2">
                          Active Filters:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {searchQuery && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => setSearchQuery("")}
                            >
                              Search: {searchQuery}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )}
                          {selectedLocation !== "all" && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => setSelectedLocation("all")}
                            >
                              {selectedLocation}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </aside>

              {/* Jobs Grid */}
              <div className="flex-1">
                {(() => {
                  const { ref, isVisible } = useInView<HTMLDivElement>();
                  return (
                    <div
                      ref={ref}
                      className={`${
                        isVisible ? "animate-fade-in-up" : "opacity-0"
                      }`}
                    >
                      {/* Results Count */}
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Showing <strong>{jobs.length}</strong> of{" "}
                          <strong>{totalCount}</strong>{" "}
                          {totalCount === 1 ? "job" : "jobs"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {jobs.map((job, index) => (
                          <Link
                            key={job.PostId}
                            href={{
                              pathname: `/recruitment/profile/${job.PostId}`,
                              query: { job: JSON.stringify(job) },
                            }}
                            className="w-full"
                          >
                            <Card
                              className={`bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full ${
                                isVisible ? "animate-slide-up" : "opacity-0"
                              }`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg mb-1">
                                      {job.JobTitle}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-foreground">
                                      {job.CompanyTitle}
                                    </CardDescription>
                                  </div>
                                  {job.urgent && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                    {job.JobLocation}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <DollarSign className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                    {job.Salary}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                      <Users className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                      {job.JobType}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                      <Clock className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                      {job.CreatedAt}
                                    </div>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-primary/10 text-primary"
                                  >
                                    {job.category}
                                  </Badge>
                                </div>
                                <div className="flex gap-4 mt-4">
                                  <Button
                                    asChild
                                    className="flex-1 bg-primary hover:bg-blue-900 text-white transition-all"
                                  >
                                    <Link
                                      href={`/recruitment/apply?jobId=${
                                        job.PostId
                                      }&jobUrl=${encodeURIComponent(
                                        job.url || "",
                                      )}`}
                                    >
                                      Apply Now
                                    </Link>
                                  </Button>
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1 bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all"
                                  >
                                    <Link
                                      href={{
                                        pathname: `/recruitment/profile/${job.PostId}`,
                                        query: { job: JSON.stringify(job) },
                                      }}
                                    >
                                      View Details
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : jobs.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-lg text-muted-foreground mb-4">
                            No jobs found matching your criteria.
                          </p>
                          {activeFiltersCount > 0 && (
                            <Button onClick={clearAllFilters} variant="outline">
                              Clear All Filters
                            </Button>
                          )}
                        </div>
                      ) : null}

                      {/* Pagination */}
                      {!isLoading && jobs.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1 || isLoading}
                          >
                            Previous
                          </Button>
                          <span className="flex items-center px-4">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setCurrentPage((p) =>
                                p < totalPages ? p + 1 : p,
                              )
                            }
                            disabled={currentPage >= totalPages || isLoading}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Consultants Section */}
          <section id="team" className="py-20">
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="text-center mb-16">
                    <h2
                      className={`text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center ${
                        isVisible ? "animate-slide-up" : "opacity-0"
                      }`}
                    >
                      <Users className="h-8 w-8 mr-2 text-accent" />
                      Meet Our Expert Consultants
                    </h2>
                    <p
                      className={`text-xl text-muted-foreground max-w-3xl mx-auto text-pretty ${
                        isVisible ? "animate-fade-in delay-100" : "opacity-0"
                      }`}
                    >
                      Our certified recruitment professionals bring decades of
                      combined experience in connecting top talent with leading
                      organizations worldwide.
                    </p>
                  </div>

                  <div className="flex justify-center gap-8">
                    {recruitmentConsultants.map((consultant, index) => (
                      <Card
                        key={consultant.name}
                        className={`relative w-full max-w-sm bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                          isVisible ? "animate-slide-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader className="pt-8 pb-4">
                          <div className="flex justify-center">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10">
                              <img
                                src={consultant.photo}
                                alt={consultant.name}
                                className={`absolute inset-0 w-full h-full object-contain bg-white ${
                                  isVisible ? "animate-scale-in" : "opacity-0"
                                }`}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-center">
                          <h3
                            className={`font-semibold text-lg ${
                              isVisible ? "animate-fade-in" : "opacity-0"
                            }`}
                          >
                            {consultant.name}
                          </h3>
                          <p
                            className={`text-sm text-muted-foreground mb-2 ${
                              isVisible
                                ? "animate-fade-in delay-100"
                                : "opacity-0"
                            }`}
                          >
                            {consultant.role}
                          </p>
                          <p
                            className={`text-sm text-pretty mb-2 ${
                              isVisible
                                ? "animate-fade-in delay-200"
                                : "opacity-0"
                            }`}
                          >
                            {consultant.description}
                          </p>
                          <p
                            className={`text-sm text-muted-foreground mb-2 ${
                              isVisible
                                ? "animate-fade-in delay-300"
                                : "opacity-0"
                            }`}
                          >
                            <strong>Email:</strong> {consultant.email}
                          </p>
                          <p
                            className={`text-sm text-muted-foreground mb-2 ${
                              isVisible
                                ? "animate-fade-in delay-400"
                                : "opacity-0"
                            }`}
                          >
                            <strong>Contact:</strong> {consultant.contactNumber}
                          </p>
                          <div
                            className={`flex flex-wrap gap-2 mt-2 justify-center ${
                              isVisible
                                ? "animate-fade-in delay-500"
                                : "opacity-0"
                            }`}
                          >
                            {consultant.certificates.map((cert) => (
                              <Badge
                                key={cert}
                                variant="secondary"
                                className="text-xs"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Blog Section */}
          {blogs.length > 0 && (
            <BlogSection
              blogs={blogs}
              title="Recruitment & Placement Insights"
              subtitle="Stay informed with the latest trends, tips, and insights in the recruitment industry."
              linkPrefix="recruitment/blogs"
            />
          )}

          {/* Applicant Success Stories */}
          {applicants.length > 0 && (
            <ApplicantSection
              blogs={applicants}
              title="Remarkable Success Stories"
              subtitle="Discover how we've helped talented professionals achieve their career dreams and helped businesses find their perfect match."
              linkPrefix="recruitment/blogs"
            />
          )}
        </div>
      </section>
    </>
  );
}
