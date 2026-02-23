"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Save } from "lucide-react";
import { useBlogService } from "@/lib/blogService";
import { useToast } from "@/hooks/use-toast";

interface AddBlogDto {
  title: string;
  content: string;
  type: string;
}

export default function AddBlogPostPage() {
  const [formData, setFormData] = useState<AddBlogDto>({
    title: "",
    content: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addBlog } = useBlogService();
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const blogDto: AddBlogDto = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
      };

      const response = await addBlog(blogDto);

      if (response.success) {
        toast({
          title: "Success",
          description:
            response.successMessage || "Blog post created successfully",
        });

        // Reset form
        setFormData({
          title: "",
          content: "",
          type: "",
        });

        // Redirect to blog posts page
        router.push("/admin/blog-posts");
      } else {
        toast({
          title: "Error",
          description: "Failed to create blog post",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the blog post",
      });
      console.error("Error creating blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="py-10">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter the full blog content"
                      rows={12}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Service Category</Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleServiceChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Recruitment_and_Placement">
                          Recruitment & Placements
                        </SelectItem>
                        <SelectItem value="Migration_and_Visa">
                          Visa & Migration
                        </SelectItem>
                        <SelectItem value="Lands_and_Home">
                          Land & Homes
                        </SelectItem>
                        <SelectItem value="Business_and_Events">
                          Business & Events
                        </SelectItem>
                        <SelectItem value="Education_and_Counseling">
                          Education & Counselling
                        </SelectItem>
                        <SelectItem value="Applicant">
                          Applicant
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Blog Post
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
