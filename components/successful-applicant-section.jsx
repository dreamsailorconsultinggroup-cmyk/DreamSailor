"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 6;

  const { ref, isVisible } = useInView<HTMLDivElement>();

  useEffect(() => {
    fetchApplicants();
  }, [currentPage]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${API_BASE}/api/successful-applicants?PageNumber=${currentPage}&PageSize=${pageSize}&IsActive=true`
      );
      const data = await res.json();

      if (data.success && data.data) {
        setApplicants(data.data.items || []);
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

  if (!isLoading && applicants.length === 0) return null;

  return (
    <div ref={ref} className="mb-20">
      {/* Section Header */}
      <div
        className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-accent" />
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Our Successful Talents
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the professionals we've placed in top organisations around the
          world.
        </p>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {totalCount} talented professionals placed
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((applicant, index) => (
              <Card
                key={applicant.successfulApplicantId}
                className={`group bg-white border border-primary/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
                }}
              >
                {/* Photo Banner */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                  {applicant.hasProfilePhoto && applicant.profilePhotoUrl ? (
                    <img
                      src={`${API_BASE}${applicant.profilePhotoUrl}`}
                      alt={applicant.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-md">
                      <User className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent" />
                </div>

                <CardContent className="pt-4 pb-5 px-5">
                  {/* Name */}
                  <h3 className="font-bold text-lg text-primary leading-tight mb-1">
                    {applicant.fullName}
                  </h3>

                  {/* Job title + company badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {applicant.jobTitle && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary flex items-center gap-1"
                      >
                        <Briefcase className="h-3 w-3" />
                        {applicant.jobTitle}
                      </Badge>
                    )}
                    {applicant.placedCompany && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-accent/10 text-accent flex items-center gap-1"
                      >
                        <Building2 className="h-3 w-3" />
                        {applicant.placedCompany}
                      </Badge>
                    )}
                    {applicant.country && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {applicant.country}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {applicant.description}
                  </p>

                  {/* CV Download */}
                  {applicant.hasCV && applicant.cvDownloadUrl && (
                    <a
                      href={`${API_BASE}${applicant.cvDownloadUrl}`}
                      download={applicant.cvFileName ?? "cv.pdf"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}