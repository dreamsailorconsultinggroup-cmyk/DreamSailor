"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  User,
  Briefcase,
  Building2,
  MapPin,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminSuccessfulApplicantsPage() {
  const [applicants, setApplicants] = useState<SuccessfulApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const pageSize = 10;

  const { toast } = useToast();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [currentPage, debouncedSearch]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        PageNumber: String(currentPage),
        PageSize: String(pageSize),
      });
      if (debouncedSearch.trim()) params.append("SearchTerm", debouncedSearch.trim());

      const res = await fetch(`${API_BASE}/api/successful-applicants?${params}`);
      const data = await res.json();

      if (data.success && data.data) {
        setApplicants(data.data.items || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalCount(data.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/api/successful-applicants/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Deleted", description: `${name} has been removed.` });
        fetchApplicants();
      } else {
        toast({ title: "Error", description: data.errorMessage ?? "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (applicant: SuccessfulApplicant) => {
    try {
      setTogglingId(applicant.successfulApplicantId);
      const body = new FormData();
      body.append("IsActive", String(!applicant.isActive));

      const res = await fetch(
        `${API_BASE}/api/successful-applicants/${applicant.successfulApplicantId}`,
        { method: "PUT", body }
      );
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Updated",
          description: `${applicant.fullName} is now ${!applicant.isActive ? "visible" : "hidden"}.`,
        });
        fetchApplicants();
      } else {
        toast({ title: "Error", description: data.errorMessage ?? "Failed to update", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-accent" />
              <div>
                <h1 className="text-3xl font-bold">Successful Applicants</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {totalCount} talent{totalCount !== 1 ? "s" : ""} in total
                </p>
              </div>
            </div>
            <Link href="/admin/add-applicant">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Applicant
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, job title, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Table Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                All Applicants
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No applicants found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">Try clearing your search</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Applicant</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Role & Company</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Country</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Files</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Added</th>
                        <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {applicants.map((applicant) => (
                        <tr
                          key={applicant.successfulApplicantId}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          {/* Applicant */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-primary/5 flex items-center justify-center flex-shrink-0">
                                {applicant.hasProfilePhoto && applicant.profilePhotoUrl ? (
                                  <img
                                    src={`${API_BASE}${applicant.profilePhotoUrl}`}
                                    alt={applicant.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-primary/30" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground leading-tight">
                                  {applicant.fullName}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">
                                  {applicant.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role & Company */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="space-y-1">
                              {applicant.jobTitle && (
                                <p className="flex items-center gap-1 text-xs text-foreground">
                                  <Briefcase className="h-3 w-3 text-primary flex-shrink-0" />
                                  {applicant.jobTitle}
                                </p>
                              )}
                              {applicant.placedCompany && (
                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Building2 className="h-3 w-3 flex-shrink-0" />
                                  {applicant.placedCompany}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Country */}
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {applicant.country && (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {applicant.country}
                              </p>
                            )}
                          </td>

                          {/* Files */}
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="flex gap-2">
                              {applicant.hasProfilePhoto && (
                                <Badge variant="secondary" className="text-xs">Photo</Badge>
                              )}
                              {applicant.hasCV && applicant.cvDownloadUrl && (
                                <a
                                  href={`${API_BASE}${applicant.cvDownloadUrl}`}
                                  download={applicant.cvFileName ?? "cv.pdf"}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                                  >
                                    <Download className="h-2.5 w-2.5" />
                                    CV
                                  </Badge>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <Badge
                              variant={applicant.isActive ? "default" : "secondary"}
                              className={`text-xs ${applicant.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500"}`}
                            >
                              {applicant.isActive ? "Visible" : "Hidden"}
                            </Badge>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                            {applicant.createdAt}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle visibility */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => handleToggleActive(applicant)}
                                disabled={togglingId === applicant.successfulApplicantId}
                                title={applicant.isActive ? "Hide from public" : "Show on public"}
                              >
                                {togglingId === applicant.successfulApplicantId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : applicant.isActive ? (
                                  <ToggleRight className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                              </Button>

                              {/* Edit */}
                              <Link href={`/admin/successful-applicants/edit/${applicant.successfulApplicantId}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>

                              {/* Delete */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(applicant.successfulApplicantId, applicant.fullName)}
                                disabled={deletingId === applicant.successfulApplicantId}
                                title="Delete"
                              >
                                {deletingId === applicant.successfulApplicantId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}