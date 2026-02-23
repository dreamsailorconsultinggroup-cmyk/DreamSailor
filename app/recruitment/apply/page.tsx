"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Briefcase } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useJobApplicantService } from "@/lib/jobApplicantService"
import { useToast } from "@/hooks/use-toast"
import { url } from "inspector"

// Form validation schema
const formSchema = z.object({
  jobPostId: z.string().min(1, { message: "Job Post ID is required" }),
  resume: z
    .any()
    .refine(
      (files) => {
        if (typeof window === "undefined") return true // Skip validation during SSR
        return files instanceof FileList && files.length > 0
      },
      { message: "Resume is required" }
    )
    .refine(
      (files) => {
        if (typeof window === "undefined") return true // Skip validation during SSR
        if (!(files instanceof FileList)) return false
        const file = files[0]
        return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)
      },
      { message: "Resume must be a PDF, DOC, or DOCX file" }
    ),
  fullname: z.string().min(1, { message: "Full name is required" }),
  contactNo: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
  email: z.string().email({ message: "Invalid email address" }),
  highestEducation: z.string().min(1, { message: "Highest education is required" }),
  address: z.string().min(1, { message: "Address is required" }),
})

export default function ApplyJobPage() {
  const searchParams = useSearchParams()
  const jobPostId = searchParams.get("jobId") || ""
  const jobUrl = searchParams.get("jobUrl") || ""
  const { toast } = useToast()

  console.log("Job URL:", jobUrl)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addApplicant } = useJobApplicantService()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPostId,
      resume: undefined,
      fullname: "",
      contactNo: "",
      email: "",
      highestEducation: "",
      address: ""
    },
  })

  // Function to handle API responses and show toasts
  const handleApplicationResponse = (response: any) => {
    if (response.success) {
      // Success response
      toast({
        title: "Success! 🎉",
        description:
          response.successMessage ||
          "Your application has been submitted successfully. We will contact you soon!",
        variant: "default",
        duration: 5000,
      })
    } else if (response.errors) {
      // Error response with validation errors
      const errorMessages = Object.entries(response.errors)
        .map(([field, messages]: [string, any]) => {
          const errorList = Array.isArray(messages) ? messages : [messages]
          return `${field}: ${errorList.join(", ")}`
        })
        .join("\n")

      toast({
        title: "Validation Error ⚠️",
        description: errorMessages,
        variant: "destructive",
        duration: 5000,
      })
    } else if (response.message) {
      // Generic error message
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Job URL:", jobUrl)
    try {
      setIsSubmitting(true)

      const resumeFile = values.resume[0]
      const payload = {
        jobPostId: values.jobPostId,
        resume: resumeFile,
        fullname: values.fullname,
        contactNo: values.contactNo,
        email: values.email,
        highestEducation: values.highestEducation,
        address: values.address,
        url: jobUrl
      }

      const response = await addApplicant(payload)

      // Handle the response with toast
      handleApplicationResponse(response)

      if (response.success) {
        // Reset form on successful submission
        form.reset({
          jobPostId,
          resume: undefined,
          fullname: "",
          contactNo: "",
          email: "",
          highestEducation: "",
          address: "",
        })
      }
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit application. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resume download
  const handleDownloadResume = (fileName: string) => {
    try {
      const fileUrl = `/resumes/${fileName}`
      const a = document.createElement("a")
      a.href = fileUrl
      a.download = fileName
      a.click()
      
      toast({
        title: "Download Started",
        description: `${fileName} is downloading...`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the resume. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header className="animate-fade-in" />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Sample Resume Section */}
        <section className="mb-16 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 mr-2 text-accent" />
              Sample Resumes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Download sample resumes to ensure your application stands out.
            </p>
          </div>
          <div className="p-6 text-center">
            <Button
              className="bg-primary hover:bg-blue-900 text-white transition-all mr-8"
              onClick={() => handleDownloadResume("sample-resume-1.pdf")}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Sample Resume 1
            </Button>
            <Button
              className="bg-primary hover:bg-blue-900 text-white transition-all mt-4"
              onClick={() => handleDownloadResume("sample-resume-2.pdf")}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Sample Resume 2
            </Button>
          </div>
        </section>

        {/* Application Form Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center">
              <Briefcase className="h-8 w-8 mr-2 text-accent" />
              Job Application Form
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Submit your details to apply for your selected job opportunity.
            </p>
          </div>
          <Card className="max-w-2xl mx-auto bg-white border border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Apply for Job</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Job Post ID */}
                  <FormField
                    control={form.control}
                    name="jobPostId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Post ID</FormLabel>
                        <FormControl>
                          <Input disabled {...field} className="bg-gray-100 text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resume */}
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Resume</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => onChange(e.target.files)}
                            {...rest}
                            className="text-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Number */}
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} className="text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Highest Education */}
                  <FormField
                    control={form.control}
                    name="highestEducation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Education</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bachelor's Degree in Computer Science" {...field} className="text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-blue-900 text-white transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all"
                    >
                      <Link href="/recruitment">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer className="animate-fade-in" />
    </div>
  )
}