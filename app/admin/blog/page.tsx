"use client";

import { Suspense, lazy, useEffect, useReducer, useState } from "react";
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
import { useRouter } from "next/navigation";

// Lazy load the heavy component
const BlogManagement = lazy(() => 
  import("@/components/admin/blog-management").then(mod => ({
    default: mod.BlogManagement
  }))
);

// Define Blog type
interface Blog {
  blogId: string; // Changed from number to string
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

// Define AddBlogDto
interface AddBlogDto {
  title: string;
  content: string;
  type: string;
}

// Define initial state for reducer
const initialState = {
  blogs: [] as Blog[],
  selectedBlog: null as Blog | null,
  isLoading: false,
  isCreating: false,
  deletingId: null as string | null, // Changed from number to string
};

// Define reducer action types
type Action =
  | { type: "SET_BLOGS"; payload: Blog[] }
  | { type: "SET_SELECTED_BLOG"; payload: Blog | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CREATING"; payload: boolean }
  | { type: "SET_DELETING_ID"; payload: string | null };

// Define reducer function
function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_BLOGS":
      return { ...state, blogs: action.payload };
    case "SET_SELECTED_BLOG":
      return { ...state, selectedBlog: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CREATING":
      return { ...state, isCreating: action.payload };
    case "SET_DELETING_ID":
      return { ...state, deletingId: action.payload };
    default:
      return state;
  }
}

export default function AdminBlogPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AddBlogDto>({
    title: "",
    content: "",
    type: "",
  });
  const { addBlog, getBlogs, getBlogById, deleteBlog } = useBlogService();
  const { toast } = useToast();
  const router = useRouter();

  const fetchBlogs = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getBlogs();
      // Assuming response.data contains the blogs array
      if (response.success && response.data) {
        dispatch({ type: "SET_BLOGS", payload: response.data });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch blogs." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
    dispatch({ type: "SET_CREATING", payload: true });

    try {
      const blogDto: AddBlogDto = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
      };

      const response = await addBlog(blogDto);
      if (response.success) {
        // Refresh the blogs list instead of trying to add response.data
        await fetchBlogs();
        setFormData({ title: "", content: "", type: "" });
        setShowForm(false);
        toast({ 
          title: "Success", 
          description: response.successMessage || "Blog created successfully." 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to create blog." 
      });
    } finally {
      dispatch({ type: "SET_CREATING", payload: false });
    }
  };

  const handleDelete = async (id: string) => {
    dispatch({ type: "SET_DELETING_ID", payload: id });

    try {
      const response = await deleteBlog(id);
      if (response.success) {
        // Refresh the blogs list instead of manually filtering
        await fetchBlogs();
        toast({ 
          title: "Success", 
          description: response.successMessage || "Blog deleted successfully." 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to delete blog." 
      });
    } finally {
      dispatch({ type: "SET_DELETING_ID", payload: null });
    }
  };

  const handleViewBlog = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await getBlogById(id);
      if (response.success && response.data) {
        dispatch({ type: "SET_SELECTED_BLOG", payload: response.data });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to fetch blog details." 
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const truncateContent = (text: string, lines: number = 2) => {
    const words = text.split(" ");
    const maxWords = lines * 15;
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section id="admin-blogs" className="py-20 bg-muted/30">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading blog management...</span>
            </div>
          }>
            <BlogManagement />
          </Suspense>
        </section>
      </main>
    </div>
  );
}