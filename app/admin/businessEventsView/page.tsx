"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Eye,
  Trash2,
  Calendar1,
} from "lucide-react";

import {
  useBusinessEventsService,
  ViewBusinessEventsDto,
  PaginatedList,
} from "@/lib/businessEventsService";

export default function BusinessEventsAdminPage() {
  const service = useBusinessEventsService();

  const [events, setEvents] = useState<PaginatedList<ViewBusinessEventsDto>>({
    currentPageNum: 1,
    totalPages: 0,
    totalCount: 0,
    pageTotal: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] =
    useState<ViewBusinessEventsDto | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [eventToDelete, setEventToDelete] =
    useState<ViewBusinessEventsDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const result = await service.getAll();
      setEvents(result);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleView = async (event: ViewBusinessEventsDto) => {
    try {
      const data = await service.getById(event.id);
      setSelectedEvent(data);
      setShowViewDialog(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch event details");
    }
  };

  const handleDelete = (event: ViewBusinessEventsDto) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await service.delete(eventToDelete.id);
      setShowDeleteDialog(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Business & Events Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 flex items-center gap-2 mb-4">
              <AlertCircle />
              {error}
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                ×
              </Button>
            </div>
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : events.items.length === 0 ? (
            <div>No submissions found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.items.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.fullName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {event.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {event.phoneNumber}
                      </div>
                    </TableCell>

                    <TableCell>{event.inquiryType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar1 className="h-3 w-3" />
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(event)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedEvent.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedEvent.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEvent.phoneNumber}
              </p>
              <p>
                <strong>Inquiry Type:</strong> {selectedEvent.inquiryType}
              </p>
              {selectedEvent.organizationName && (
                <p>
                  <strong>Organization:</strong>{" "}
                  {selectedEvent.organizationName}
                </p>
              )}
              {selectedEvent.eventDate && (
                <p>
                  <strong>Event Date:</strong>{" "}
                  {formatDate(selectedEvent.eventDate)}
                </p>
              )}
              {selectedEvent.budgetRange && (
                <p>
                  <strong>Budget:</strong> {selectedEvent.budgetRange}
                </p>
              )}
              {selectedEvent.message && (
                <p>
                  <strong>Message:</strong> {selectedEvent.message}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
