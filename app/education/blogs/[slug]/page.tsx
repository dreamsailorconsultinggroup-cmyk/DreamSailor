"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBlogService } from "@/lib/blogService";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getBlogById } = useBlogService();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) return;

        // Fetch blog using your service
        const response = await getBlogById(slug as string);

        // Extract the data from the response
        if (response.success && response.data) {
          setBlog(response.data);
        } else {
          setError( "Blog not found");
          notFound();
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error instanceof Error ? error.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, getBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-lg text-muted-foreground">
        Loading blog...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-lg text-red-600 mb-4">{error || "Blog not found"}</p>
        <Button asChild variant="outline">
          <Link href="/education">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to education
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button asChild variant="outline" className="mb-6">
            <Link href="/recruitment">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Recruitment
            </Link>
          </Button>

          {/* Blog card */}
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
                {blog.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Published on {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {blog.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}