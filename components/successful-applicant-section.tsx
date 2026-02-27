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
        className={`text-center mb-10 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="h-7 w-7 text-accent" />
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Our Successful Talents
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

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {applicants.map((applicant, index) => (
              <Card
                key={applicant.successfulApplicantId}
                className={`group bg-white border border-primary/10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 60}ms` : "0ms",
                }}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  {/* Circular Photo */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm mb-3 flex-shrink-0 bg-primary/5 flex items-center justify-center">
                    {applicant.hasProfilePhoto && applicant.profilePhotoUrl ? (
                      <img
                        src={`${API_BASE}${applicant.profilePhotoUrl}`}
                        alt={applicant.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary/30" />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-sm text-primary leading-tight mb-1 line-clamp-2">
                    {applicant.fullName}
                  </h3>

                  {/* Job Title */}
                  {applicant.jobTitle && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Briefcase className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{applicant.jobTitle}</span>
                    </p>
                  )}

                  {/* Company */}
                  {applicant.placedCompany && (
                    <p className="text-xs text-accent font-medium flex items-center gap-1 mb-1">
                      <Building2 className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{applicant.placedCompany}</span>
                    </p>
                  )}

                  {/* Country */}
                  {applicant.country && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{applicant.country}</span>
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3 w-full text-left">
                    {applicant.description}
                  </p>

                  {/* CV Download */}
                  {applicant.hasCV && applicant.cvDownloadUrl && (
                    <a
                      href={`${API_BASE}${applicant.cvDownloadUrl}`}
                      download={applicant.cvFileName ?? "cv.pdf"}
                      className="w-full mt-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-white transition-all h-7 px-2"
                      >
                        <Download className="h-3 w-3 mr-1" />
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
            <div className="flex justify-center items-center gap-3 mt-8">
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