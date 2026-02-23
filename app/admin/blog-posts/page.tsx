"use client";

import { BlogManagement } from "@/components/admin/blog-management";

export default function BlogPostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="py-10">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Blog Posts</h1>
            <BlogManagement />
          </div>
        </section>
      </main>
    </div>
  );
}