"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AddSuccessfulApplicantPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    jobTitle: "",
    placedCompany: "",
    country: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      if (profilePhoto) body.append("ProfilePhoto", profilePhoto);
      if (cvFile) body.append("CvFile", cvFile);

      const res = await fetch(`${API_BASE}/api/successful-applicants`, {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Applicant added successfully" });
        router.push("/admin/applicants");
      } else {
        toast({
          title: "Error",
          description: data.errorMessage ?? "Failed to add applicant",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="py-10">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Add Successful Applicant</h1>

          <Card>
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Smith"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="A short bio or success story (max 500 characters)"
                    rows={4}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Job Title */}
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                {/* Placed Company */}
                <div>
                  <Label htmlFor="placedCompany">Placed Company</Label>
                  <Input
                    id="placedCompany"
                    name="placedCompany"
                    value={formData.placedCompany}
                    onChange={handleInputChange}
                    placeholder="e.g. Atlassian"
                  />
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. Australia"
                  />
                </div>

                {/* Profile Photo */}
                <div>
                  <Label htmlFor="profilePhoto">Profile Photo (JPG / PNG / WEBP, max 5 MB)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-muted transition-colors">
                        <Upload className="h-4 w-4" />
                        {profilePhoto ? profilePhoto.name : "Choose photo"}
                      </div>
                      <input
                        id="profilePhoto"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <Label htmlFor="cvFile">CV / Resume (PDF / DOC / DOCX, max 10 MB)</Label>
                  <label className="cursor-pointer mt-1 block">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-muted transition-colors w-fit">
                      <FileText className="h-4 w-4" />
                      {cvFile ? cvFile.name : "Choose CV file"}
                    </div>
                    <input
                      id="cvFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvChange}
                    />
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add Applicant
                    </>
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