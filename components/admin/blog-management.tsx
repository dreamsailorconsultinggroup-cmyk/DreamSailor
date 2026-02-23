"use client";

import React, { useEffect, useState } from "react";
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
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useBlogService } from "@/lib/blogService";
import { useToast } from "@/hooks/use-toast";

// Define Blog type
interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

// Service type options
const SERVICE_OPTIONS = [
  { value: "Recruitment_and_Placement", label: "Recruitment & Placements" },
  { value: "Migration_and_Visa", label: "Visa & Migration" },
  { value: "Lands_and_Home", label: "Land & Homes" },
  { value: "Business_and_Events", label: "Business & Events" },
  { value: "Education_and_Counseling", label: "Education & Counselling" },
] as const;

export const BlogManagement = () => {
  // State management
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [service, setService] = useState("");

  const { addBlog, getBlogs, getBlogById, deleteBlog } = useBlogService();
  const { toast } = useToast();

  // Fetch blogs from server
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await getBlogs();
      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setContent("");
    setService("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !service) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await addBlog({ title: title.trim(), content: content.trim(), type: service });

      if (response.success) {
        await fetchBlogs();
        resetForm();
        setShowForm(false);

        toast({
          title: "Success",
          description: "Blog created successfully.",
        });
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle blog deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    setDeletingId(id);

    try {
      const response = await deleteBlog(id);
      if (response.success) {
        await fetchBlogs();

        if (selectedBlog?.blogId === id) setSelectedBlog(null);

        toast({
          title: "Success",
          description: "Blog deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Handle viewing a blog
  const handleViewBlog = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getBlogById(id);
      if (response.success && response.data) setSelectedBlog(response.data);
      else throw new Error("Failed to fetch blog details");
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Truncate content for preview
  const truncateContent = (text: string, lines: number = 2) => {
    if (!text) return "";
    const words = text.split(" ");
    const maxWords = lines * 15;
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
  };

  // Handle dialog close
  const handleCloseDialog = () => setSelectedBlog(null);

  // Toggle form
  const handleToggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) resetForm();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Manage Blogs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create and manage blog posts for Dream Sailor Consulting services.
        </p>
        <Button onClick={handleToggleForm} className="mt-4">
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? "Cancel" : "Create New Blog Post"}
        </Button>
      </div>

      {/* Create Blog Form */}
      {showForm && (
        <div className="mb-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create a New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog post title"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the full blog content"
                    rows={8}
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <Label htmlFor="service">Service</Label>
                  <Select value={service} onValueChange={setService} disabled={isCreating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isCreating || !title.trim() || !content.trim() || !service}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5 mr-2" />
                      Publish Blog Post
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blog List */}
      {isLoading && blogs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <Card key={post.blogId} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {post.createdAt} | {post.type}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {truncateContent(post.content)}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleViewBlog(post.blogId)} disabled={isLoading}>
                    <Eye className="h-5 w-5 mr-2" />
                    View
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(post.blogId)} disabled={deletingId === post.blogId}>
                    {deletingId === post.blogId ? (
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
      )}

      {/* View Blog Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedBlog ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBlog.title}</DialogTitle>
                <DialogDescription>
                  {selectedBlog.createdAt} | {selectedBlog.type}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-foreground">{selectedBlog.content}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedBlog.blogId)}
                  disabled={deletingId === selectedBlog.blogId}
                >
                  {deletingId === selectedBlog.blogId ? (
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
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground">Failed to load blog details</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
