"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  MapPin,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  User,
  Trophy,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface SuccessfulApplicant {
  successfulApplicantId: string;
  fullName: string;
  description: string;
  jobTitle?: string;
  placedCompany?: string;
  country?: string;
  profilePhotoUrl?: string;
  cvDownloadUrl?: string;
  cvFileName?: string;
  hasProfilePhoto: boolean;
  hasCV: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function SuccessfulApplicantsSection() {
  const [applicants, setApplicants] = useState<SuccessfulApplicant[]>([]);
  const [allApplicants, setAllApplicants] = useState<SuccessfulApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedJobTitle, setSelectedJobTitle] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [countries, setCountries] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const { ref, isVisible } = useInView<HTMLDivElement>();

  useEffect(() => {
    fetchAllForFilters();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [currentPage, searchQuery, selectedCountry, selectedJobTitle]);

  const fetchAllForFilters = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/successful-applicants?PageNumber=1&PageSize=200&IsActive=true`
      );
      const data = await res.json();
      if (data.success && data.data?.items) {
        const items: SuccessfulApplicant[] = data.data.items;
        setAllApplicants(items);
        setCountries([...new Set(items.map((a) => a.country).filter(Boolean) as string[])].sort());
        setJobTitles([...new Set(items.map((a) => a.jobTitle).filter(Boolean) as string[])].sort());
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        PageNumber: String(currentPage),
        PageSize: String(pageSize),
        IsActive: "true",
      });
      if (searchQuery.trim()) params.append("SearchTerm", searchQuery.trim());

      const res = await fetch(`${API_BASE}/api/successful-applicants?${params}`);
      const data = await res.json();

      if (data.success && data.data) {
        let items: SuccessfulApplicant[] = data.data.items || [];

        if (selectedCountry !== "all") {
          items = items.filter((a) => a.country === selectedCountry);
        }
        if (selectedJobTitle !== "all") {
          items = items.filter((a) => a.jobTitle === selectedJobTitle);
        }

        setApplicants(items);
        setTotalPages(data.data.totalPages || 1);
        setTotalCount(data.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching successful applicants:", error);
      setApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedJobTitle("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedCountry !== "all" || selectedJobTitle !== "all";

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isLoading && allApplicants.length === 0) return null;

  return (
    <div ref={ref} className="mb-20 px-4 sm:px-6 lg:px-8">
      {/* Container to center and limit width */}
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="h-7 w-7 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Our talents ( onshore / offshore )
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Meet the professionals we've placed in top organisations around the world.
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} talented professionals placed
            </p>
          )}
        </div>

        {/* Filters - Centered */}
        <div
          className={`flex flex-col sm:flex-row justify-center items-center gap-3 mb-10 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Country filter */}
          {countries.length > 0 && (
            <Select value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-44 bg-white">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Job Title filter */}
          {jobTitles.length > 0 && (
            <Select value={selectedJobTitle} onValueChange={(v) => { setSelectedJobTitle(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Job Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Titles</SelectItem>
                {jobTitles.map((j) => (
                  <SelectItem key={j} value={j}>{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-primary">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Loading / Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-20 bg-primary/5 rounded-xl border border-dashed border-primary/20">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20 text-primary" />
            <p className="text-lg font-medium text-primary">No applicants match your search</p>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {/* Cards Grid - Centered items via grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {applicants.map((applicant, index) => (
                <Card
                  key={applicant.successfulApplicantId}
                  className={`group bg-white border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
                >
                  <CardContent className="p-5 flex flex-col items-center text-center h-full">
                    {/* Circular Photo */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/5 shadow-inner mb-4 flex-shrink-0 bg-primary/5 flex items-center justify-center">
                      {applicant.hasProfilePhoto && applicant.profilePhotoUrl ? (
                        <img
                          src={`${API_BASE}${applicant.profilePhotoUrl}`}
                          alt={applicant.fullName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <User className="h-10 w-10 text-primary/30" />
                      )}
                    </div>

                    <h3 className="font-bold text-base text-primary leading-tight mb-2 line-clamp-2">
                      {applicant.fullName}
                    </h3>

                    <div className="space-y-1.5 mb-4">
                      {applicant.jobTitle && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                          <Briefcase className="h-3 w-3 text-accent" />
                          <span className="line-clamp-1">{applicant.jobTitle}</span>
                        </p>
                      )}
                      {applicant.placedCompany && (
                        <p className="text-xs text-primary font-semibold flex items-center justify-center gap-1.5">
                          <Building2 className="h-3 w-3" />
                          <span className="line-clamp-1">{applicant.placedCompany}</span>
                        </p>
                      )}
                      {applicant.country && (
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          <span>{applicant.country}</span>
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-6 italic">
                      "{applicant.description}"
                    </p>

                    {applicant.cvDownloadUrl && (
                      <div className="mt-auto w-full">
                        <a
                          href={`${API_BASE}${applicant.cvDownloadUrl}`}
                          download={applicant.cvFileName ?? "cv.pdf"}
                          className="block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-primary/20 text-primary hover:bg-primary hover:text-white transition-all gap-2"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Resume
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-primary/5"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                   <span className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {currentPage}
                   </span>
                   <span className="text-xs text-muted-foreground">of {totalPages}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="hover:bg-primary/5"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
