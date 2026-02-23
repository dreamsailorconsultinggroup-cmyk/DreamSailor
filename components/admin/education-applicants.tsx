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
  DialogTrigger,
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
  AlertDialogTrigger,
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
} from "lucide-react";
import {
  useEducationService,
  ViewEduClientDto,
  FilterEduClientDto,
  PaginatedList,
} from "@/lib/educationService";

export default function EducationApplicantsComponent() {
  const educationService = useEducationService();

  // State management
  const [clients, setClients] = useState<PaginatedList<ViewEduClientDto>>({
    currentPageNum: 1,
    totalPages: 0,
    totalCount: 0,
    pageTotal: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ViewEduClientDto | null>(
    null
  );
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ViewEduClientDto | null>(
    null
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [educationTypeFilter, setEducationTypeFilter] = useState("all");
  const [sortLatest, setSortLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data from backend
  const fetchClients = async (filters?: FilterEduClientDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const filterDto: FilterEduClientDto = {
        pageNumber: currentPage,
        pageSize: pageSize,
        searchName: searchTerm || undefined,
        latest: sortLatest,
        preferredCountry: countryFilter !== "all" ? countryFilter : undefined,
        preferredEducationType:
          educationTypeFilter !== "all" ? educationTypeFilter : undefined,
        ...filters,
      };

      const result = await educationService.getAllClients(filterDto);
      setClients(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchClients();
  }, [currentPage, pageSize, sortLatest]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchClients();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, countryFilter, educationTypeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewClient = async (client: ViewEduClientDto) => {
    try {
      // Fetch detailed client information
      const detailedClient = await educationService.getClientById(
        client.eduCounselingId
      );
      setSelectedClient(detailedClient);
      setShowViewDialog(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch client details"
      );
    }
  };

  const handleDownloadResume = async (client: ViewEduClientDto) => {
    try {
      const fileData = await educationService.downloadResume(
        client.eduCounselingId
      );

      // Determine file type from filename
      const fileExtension = client.resumeName.split(".").pop()?.toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") {
        mimeType = "application/pdf";
      } else if (fileExtension === "doc") {
        mimeType = "application/msword";
      } else if (fileExtension === "docx") {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      educationService.downloadFileFromBase64(
        fileData.fileName,
        fileData.bytes,
        mimeType
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to download resume"
      );
    }
  };

  const handleDeleteClient = (client: ViewEduClientDto) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    console.log("Deleting client:", clientToDelete.eduCounselingId);

    try {
      const result = await educationService.deleteClient(
        clientToDelete.eduCounselingId
      );
      console.log("Delete result:", result);
      setShowDeleteDialog(false);
      setClientToDelete(null);
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
    }
  };

  const handleRefresh = () => {
    fetchClients();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Get unique countries and education types for filters
  const getUniqueValues = (
    items: ViewEduClientDto[],
    key: keyof ViewEduClientDto
  ): string[] => {
    const values = items.map((item) => String(item[key])).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const uniqueCountries = getUniqueValues(clients.items, "preferredCountry");
  const uniqueEducationTypes = getUniqueValues(
    clients.items,
    "preferredEducationType"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Education Applicants
          </h1>
          <p className="text-muted-foreground">
            Manage and review education applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </p>
                <p className="text-2xl font-bold">{clients.totalCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Page
                </p>
                <p className="text-2xl font-bold">{clients.totalPages}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </p>
                <p className="text-2xl font-bold">{clients.pageTotal}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Page {clients.currentPageNum}
                </p>
                <p className="text-2xl font-bold">of {clients.totalPages}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table with Integrated Filters */}
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center justify-between">
            <span>Applications ({clients.totalCount})</span>
            <Badge variant="outline" className="ml-2">
              Page {clients.currentPageNum} of {clients.totalPages}
            </Badge>
          </CardTitle>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="country">Preferred Country</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="educationType">Education Type</Label>
              <Select
                value={educationTypeFilter}
                onValueChange={setEducationTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueEducationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-32">
              <Label htmlFor="sort">Sort Order</Label>
              <Select
                value={sortLatest ? "latest" : "oldest"}
                onValueChange={(value) => setSortLatest(value === "latest")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          ) : clients.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Education & Course</TableHead>
                    <TableHead>Preferred Country</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.items.map((client) => (
                    <TableRow key={client.eduCounselingId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{client.fullname}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.highestCompletedEducation}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {client.contactNo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.desiredCourse}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.preferredEducationType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{client.preferredCountry}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(client.appliedDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadResume(client)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {client.resumeName}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClient(client)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {clients.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize">Items per page:</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={clients.currentPageNum === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(clients.currentPageNum - 1)}
              disabled={clients.currentPageNum === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {clients.currentPageNum} of {clients.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(clients.currentPageNum + 1)}
              disabled={clients.currentPageNum === clients.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(clients.totalPages)}
              disabled={clients.currentPageNum === clients.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Client Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedClient?.fullname}
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <p className="font-medium">{selectedClient.fullname}</p>
                </div>
                <div className="space-y-2">
                  <Label>Highest Education</Label>
                  <p className="font-medium">
                    {selectedClient.highestCompletedEducation}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="font-medium">{selectedClient.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <p className="font-medium">{selectedClient.contactNo}</p>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <p className="font-medium">{selectedClient.address}</p>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Country</Label>
                  <p className="font-medium">
                    {selectedClient.preferredCountry}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Desired Course</Label>
                  <p className="font-medium">{selectedClient.desiredCourse}</p>
                </div>
                <div className="space-y-2">
                  <Label>Education Type</Label>
                  <p className="font-medium">
                    {selectedClient.preferredEducationType}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Application Date</Label>
                  <p className="font-medium">
                    {formatDate(selectedClient.appliedDate)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Resume</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadResume(selectedClient)}
                    className="w-full"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Download {selectedClient.resumeName}
                  </Button>
                </div>
                {selectedClient.additionalNote && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>Additional Notes</Label>
                    <p className="font-medium bg-muted p-3 rounded-md">
                      {selectedClient.additionalNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application for{" "}
              {clientToDelete?.fullname}? This action cannot be undone and will
              permanently remove all associated data including the resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded"
              >
                Delete Application
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
