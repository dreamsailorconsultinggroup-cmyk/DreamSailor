"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, User, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function EditSuccessfulApplicantPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    jobTitle: "",
    placedCompany: "",
    country: "",
    isActive: true,
  });
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [existingCvName, setExistingCvName] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchApplicant();
  }, [id]);

  const fetchApplicant = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/successful-applicants/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        const a = data.data;
        setFormData({
          fullName: a.fullName ?? "",
          description: a.description ?? "",
          jobTitle: a.jobTitle ?? "",
          placedCompany: a.placedCompany ?? "",
          country: a.country ?? "",
          isActive: a.isActive ?? true,
        });
        if (a.hasProfilePhoto && a.profilePhotoUrl) {
          setExistingPhotoUrl(`${API_BASE}${a.profilePhotoUrl}`);
        }
        if (a.hasCV && a.cvFileName) {
          setExistingCvName(a.cvFileName);
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load applicant", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append("FullName", formData.fullName);
      body.append("Description", formData.description);
      if (formData.jobTitle) body.append("JobTitle", formData.jobTitle);
      if (formData.placedCompany) body.append("PlacedCompany", formData.placedCompany);
      if (formData.country) body.append("Country", formData.country);
      body.append("IsActive", String(formData.isActive));
      if (profilePhoto) body.append("ProfilePhoto", profilePhoto);
      if (cvFile) body.append("CvFile", cvFile);

      const res = await fetch(`${API_BASE}/api/successful-applicants/${id}`, {
        method: "PUT",
        body,
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Applicant updated successfully" });
        router.push("/admin/successful-applicants");
      } else {
        toast({ title: "Error", description: data.errorMessage ?? "Update failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="py-10">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/admin/successful-applicants">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Applicant</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Update Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description" name="description" value={formData.description}
                    onChange={handleInputChange} rows={4} maxLength={500} required
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/500</p>
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                </div>

                <div>
                  <Label htmlFor="placedCompany">Placed Company</Label>
                  <Input id="placedCompany" name="placedCompany" value={formData.placedCompany} onChange={handleInputChange} />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center gap-3">
                  <Label>Visible on public page</Label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-muted-foreground">{formData.isActive ? "Visible" : "Hidden"}</span>
                </div>

                {/* Profile Photo */}
                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden border bg-muted flex items-center justify-center flex-shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : existingPhotoUrl ? (
                        <img src={existingPhotoUrl} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-muted transition-colors">
                        <Upload className="h-4 w-4" />
                        {profilePhoto ? profilePhoto.name : "Replace photo"}
                      </div>
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>
                </div>

                {/* CV */}
                <div>
                  <Label>CV / Resume</Label>
                  {existingCvName && !cvFile && (
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Current: <span className="font-medium">{existingCvName}</span>
                    </p>
                  )}
                  <label className="cursor-pointer block">
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-muted transition-colors w-fit">
                      <FileText className="h-4 w-4" />
                      {cvFile ? cvFile.name : "Replace CV"}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} />
                  </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Save Changes</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}