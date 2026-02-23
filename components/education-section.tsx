"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Globe,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import BlogSection from "./ui/blog-card-view";
import { useEffect, useState } from "react";
import { useBlogService } from "@/lib/blogService";
import Link from "next/link";
import type { EducationApplicationFormData } from "@/lib/educationApplicationService";
import {
  ServiceDialog,
  type ServiceDetails,
} from "@/components/ui/service-dialog";
import { createPortal } from "react-dom";
import { useInView } from "@/hooks/use-in-view";
import { Badge } from "./ui/badge";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

type University = {
  name: string;
  url: string;
};

type UniversityGroup = {
  name: string;
  universities: University[];
};

type AustralianStateGroup = {
  name: string;
  states: Record<string, University[]>;
};

type UniversitiesMap = {
  australia: AustralianStateGroup;
  uk: UniversityGroup;
  usa: UniversityGroup;
  canada: UniversityGroup;
  newzealand: UniversityGroup;
};

interface Consultant {
  name: string;
  role: string;
  description: string;
  photo: string;
  certificates: string[];
  email: string;
  contactNumber: string;
}

type CountryKey = keyof UniversitiesMap;

const universities: UniversitiesMap = {
  australia: {
    name: "Australia",
    states: {
      NSW: [
        { name: "University of Sydney", url: "https://www.sydney.edu.au/" },
        {
          name: "University of New South Wales (UNSW)",
          url: "https://www.unsw.edu.au/",
        },
        { name: "TAFE NSW", url: "https://www.tafensw.edu.au/" },
      ],
      VIC: [
        { name: "University of Melbourne", url: "https://www.unimelb.edu.au/" },
        { name: "Monash University", url: "https://www.monash.edu/" },
        {
          name: "Melbourne Polytechnic",
          url: "https://www.melbournepolytechnic.edu.au/",
        },
      ],
      QLD: [
        { name: "University of Queensland", url: "https://www.uq.edu.au/" },
        {
          name: "Queensland University of Technology (QUT)",
          url: "https://www.qut.edu.au/",
        },
        { name: "TAFE Queensland", url: "https://tafeqld.edu.au/" },
      ],
      WA: [
        {
          name: "University of Western Australia",
          url: "https://www.uwa.edu.au/",
        },
        { name: "Curtin University", url: "https://www.curtin.edu.au/" },
        {
          name: "South Regional TAFE",
          url: "https://www.southregionaltafe.wa.edu.au/",
        },
      ],
      SA: [
        { name: "University of Adelaide", url: "https://www.adelaide.edu.au/" },
        { name: "Flinders University", url: "https://www.flinders.edu.au/" },
        {
          name: "University of South Australia",
          url: "https://www.unisa.edu.au/",
        },
      ],
      TAS: [
        { name: "University of Tasmania", url: "https://www.utas.edu.au/" },
        { name: "TasTAFE", url: "https://www.tastafe.tas.edu.au/" },
      ],
      ACT: [
        {
          name: "Australian National University",
          url: "https://www.anu.edu.au/",
        },
        { name: "University of Canberra", url: "https://www.canberra.edu.au/" },
        {
          name: "Canberra Institute of Technology",
          url: "https://cit.edu.au/",
        },
      ],
      NT: [
        { name: "Charles Darwin University", url: "https://www.cdu.edu.au/" },
        { name: "Batchelor Institute", url: "https://www.batchelor.edu.au/" },
      ],
    },
  },
  uk: {
    name: "United Kingdom",
    universities: [
      { name: "University of Oxford", url: "https://www.ox.ac.uk/" },
      { name: "University of Cambridge", url: "https://www.cam.ac.uk/" },
      { name: "Imperial College London", url: "https://www.imperial.ac.uk/" },
      {
        name: "London School of Economics (LSE)",
        url: "https://www.lse.ac.uk/",
      },
      {
        name: "University College London (UCL)",
        url: "https://www.ucl.ac.uk/",
      },
    ],
  },
  usa: {
    name: "United States",
    universities: [
      { name: "MIT", url: "https://www.mit.edu/" },
      { name: "Stanford University", url: "https://www.stanford.edu/" },
      { name: "Harvard University", url: "https://www.harvard.edu/" },
      { name: "UC Berkeley", url: "https://www.berkeley.edu/" },
      { name: "University of Michigan", url: "https://umich.edu/" },
    ],
  },
  canada: {
    name: "Canada",
    universities: [
      { name: "University of Toronto", url: "https://www.utoronto.ca/" },
      { name: "University of British Columbia", url: "https://www.ubc.ca/" },
      { name: "McGill University", url: "https://www.mcgill.ca/" },
      { name: "University of Alberta", url: "https://www.ualberta.ca/" },
      { name: "University of Waterloo", url: "https://uwaterloo.ca/" },
    ],
  },
  newzealand: {
    name: "New Zealand",
    universities: [
      { name: "University of Auckland", url: "https://www.auckland.ac.nz/" },
      { name: "University of Otago", url: "https://www.otago.ac.nz/" },
      {
        name: "Victoria University of Wellington",
        url: "https://www.wgtn.ac.nz/",
      },
      {
        name: "University of Canterbury",
        url: "https://www.canterbury.ac.nz/",
      },
      { name: "AUT University", url: "https://www.aut.ac.nz/" },
    ],
  },
};

const recruitmentConsultants: Consultant[] = [
  {
    name: "Ms. Saglina Shrestha",
    role: "Founder/ Managing Director",
    description:
      "Expert in matching candidates with executive positions, she has successfully placed over 500 professionals in multinational corporations worldwide.",
    photo: "/Salina_Shrestha.png",
    certificates: [
      "Executive Search Certification",
      "LinkedIn Recruiter Certification",
      "Talent Management Diploma",
    ],
    email: "enquiry@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
];

export function EducationSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [formData, setFormData] = useState<EducationApplicationFormData>({
    fullname: "",
    email: "",
    contactNo: "",
    highestEducation: "",
    address: "",
    desiredCourse: "",
    preferredCountry: "",
    preferredEducationType: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getBlogByService } = useBlogService();
  const [openCountry, setOpenCountry] = useState<CountryKey | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleOpen = (e: React.MouseEvent, key: CountryKey) => {
    if (openCountry === key) {
      setOpenCountry(null);
      setHoverState(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // Position for desktop popover
    setPopupPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
    setOpenCountry(key);
    setHoverState(null);
  };

  const services: ServiceDetails[] = [
    {
      id: 1,
      title: "Study Abroad Programs",
      description:
        "Comprehensive guidance for international education opportunities in top universities worldwide.",
      features: [
        "University Selection",
        "Application Support",
        "Visa Assistance",
        "Pre-departure Briefing",
        "Accommodation Support",
        "Cultural Orientation",
      ],
      extendedDescription: [
        "Our Study Abroad Programs offer end-to-end support for students looking to pursue education in prestigious international universities. We provide personalized guidance to match your academic interests, career goals, and budget with the right international education opportunities.",
        "Our experienced counselors have partnerships with over 200 universities worldwide, ensuring you get access to quality education and the best possible scholarships and financial aid options.",
      ],
      requirements: [
        "Academic transcripts and certificates",
        "Passport and identification documents",
        "Proof of English proficiency (IELTS/TOEFL)",
        "Statement of purpose",
        "Letters of recommendation",
      ],
      duration: "3-6 months process",
      rating: 4.9,
      students: 1200,
      icon: <Globe className="h-8 w-8 text-primary" />,
      image: "/international-university-campus-students.jpg",
    },
    {
      id: 2,
      title: "Career Counselling",
      description:
        "Professional career guidance to help you make informed decisions about your future.",
      features: [
        "Career Assessment",
        "Industry Insights",
        "Skill Development",
        "Job Market Analysis",
        "Resume Building",
        "Interview Preparation",
      ],
      extendedDescription: [
        "Our Career Counselling service helps you identify your strengths, interests, and career goals through scientific assessment tools and personalized guidance sessions with experienced career coaches.",
        "We provide up-to-date industry insights and job market analysis to help you make informed decisions about your career path and identify the skills you need to develop for your dream job.",
      ],
      requirements: [
        "Completed education profile",
        "Previous work experience (if any)",
        "Career interests and goals",
      ],
      duration: "1-3 months program",
      rating: 4.8,
      students: 800,
      icon: <Users className="h-8 w-8 text-primary" />,
      image: "/career-counseling-professional-meeting.jpg",
    },
    {
      id: 3,
      title: "Academic Coaching",
      description:
        "Personalized academic support to help students excel in their educational journey.",
      features: [
        "Study Planning",
        "Exam Preparation",
        "Research Guidance",
        "Academic Writing",
        "Subject Tutoring",
        "Time Management",
      ],
      extendedDescription: [
        "Our Academic Coaching program offers personalized support to help students overcome academic challenges and excel in their studies. We work closely with students to develop effective study strategies, improve time management skills, and build academic confidence.",
        "Our coaches are experienced educators and subject matter experts who provide guidance on specific subjects, research methodologies, and academic writing techniques tailored to your educational level and goals.",
      ],
      requirements: [
        "Current academic transcripts",
        "Learning goals and objectives",
        "Specific subjects needing assistance",
      ],
      duration: "Flexible scheduling",
      rating: 4.7,
      students: 600,
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      image: "/academic-tutoring-student-learning.jpg",
    },
  ];

  const educationTypes = [
    "Undergraduate",
    "Postgraduate",
    "PhD",
    "Diploma",
    "Certificate",
    "Vocational",
  ];

  const countries = [
    "Australia",
    "Canada",
    "United Kingdom",
    "United States",
    "New Zealand",
    "Germany",
    "Japan",
    "Singapore",
  ];

  const fetchBlogs = async () => {
    try {
      const response = await getBlogByService("Education_and_Counseling");

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        console.error("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const { educationApplicationService } =
        await import("@/lib/educationApplicationService");
      const result =
        await educationApplicationService.submitApplication(formData);

      if (result.success) {
        setFormSuccess(true);
        setFormData({
          fullname: "",
          email: "",
          contactNo: "",
          highestEducation: "",
          address: "",
          desiredCourse: "",
          preferredCountry: "",
          preferredEducationType: "",
          resume: null,
        });
      } else {
        throw new Error(result.errorMessage || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-scale-in">
          <img
            src="/international-university-campus-students.jpg"
            alt="Education campus"
            className="w-full h-full object-cover animate-fade-in scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-primary/70 animate-fade-in"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance animate-fade-in">
            Your Future Begins <span className="text-secondary">Here</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-100">
            Transform your educational journey with expert guidance and
            personalized counseling services tailored to your academic
            aspirations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-150">
            <Link href="/book-consultation">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-3 animate-pulse-slow"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </Link>
            <Link href="#education-services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white hover:border-white/50"
              >
                Explore Programs
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center space-x-3 justify-center animate-fade-in-up delay-200">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs shadow-lg">
                4.9
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg"
                >
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
              ))}
            </div>
            <span className="text-sm text-white/80">
              <span className="font-medium text-white">500+</span> satisfied
              students
            </span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="education-services" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Education & Counselling
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Unlock your potential with our comprehensive educational services
              and expert counselling programs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/40 hover:border-primary/30 p-0"
              >
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 p-2 rounded-lg shadow-md z-20">
                    {service.icon}
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-pretty">
                    {service.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {service.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {service.students}+ students
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-sm">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-background text-foreground hover:bg-primary hover:text-white transition-colors border border-border"
                    onClick={() => {
                      setSelectedService(service);
                      setIsDialogOpen(true);
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Certified Education Counsellor
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our counsellors are qualified professionals certified by ICEF
                Academy
              </p>
            </div>
            <div className="w-full max-w-md mx-auto">
              <img
                src="./education certification.png"
                alt="ICEF Academy Education Agent Training Course Certificate"
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>

          <section className="py-12 sm:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Partner Universities
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
                  Explore universities by country and region.
                </p>
              </div>

              {/* COUNTRY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {(Object.entries(universities) as [CountryKey, any][]).map(
                  ([key, data]) => (
                    <div key={key} className="relative">
                      <button
                        onClick={(e) => handleOpen(e, key as CountryKey)}
                        className="w-full rounded-xl border border-border bg-card px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center shadow-sm hover:shadow-md transition-all active:scale-95"
                      >
                        <span className="text-base sm:text-lg font-semibold">
                          {data.name}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${openCountry === key ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Mobile inline dropdown */}
                      {openCountry === key && (
                        <div className="md:hidden mt-2 rounded-xl border border-border bg-card shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                          {key === "australia" ? (
                            <div className="flex flex-col">
                              {Object.keys(universities.australia.states).map(
                                (state) => (
                                  <div key={state}>
                                    <button
                                      onClick={() =>
                                        setHoverState(
                                          hoverState === state ? null : state,
                                        )
                                      }
                                      className={`w-full px-4 py-3 flex justify-between items-center transition-colors border-b border-border/50 ${hoverState === state ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                                    >
                                      <span className="font-medium">
                                        {state}
                                      </span>
                                      <ChevronRight
                                        className={`w-4 h-4 transition-transform ${hoverState === state ? "rotate-90" : ""}`}
                                      />
                                    </button>
                                    {hoverState === state && (
                                      <div className="bg-muted/30 px-2 py-2">
                                        {universities.australia.states[
                                          state
                                        ].map((uni) => (
                                          <a
                                            key={uni.name}
                                            href={uni.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-center px-4 py-3 rounded-md hover:bg-primary/5 transition-colors"
                                          >
                                            <span className="text-sm">
                                              {uni.name}
                                            </span>
                                            <ExternalLink className="w-4 h-4 opacity-40" />
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="p-2">
                              {universities[key].universities.map((uni) => (
                                <a
                                  key={uni.name}
                                  href={uni.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex justify-between items-center px-4 py-4 rounded-lg hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0"
                                >
                                  <span className="text-sm">{uni.name}</span>
                                  <ExternalLink className="w-4 h-4 opacity-40" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* DESKTOP PORTAL CONTENT */}
            {openCountry &&
              typeof window !== "undefined" &&
              createPortal(
                <>
                  {/* Desktop backdrop: Invisible click catcher */}
                  <div
                    className="hidden md:block fixed inset-0 z-40"
                    onClick={() => setOpenCountry(null)}
                  />

                  <div
                    className="hidden md:flex z-50 bg-card border border-border shadow-2xl rounded-xl absolute"
                    style={{
                      top: popupPosition?.top,
                      left: popupPosition?.left,
                    }}
                  >
                    {openCountry === "australia" ? (
                      <>
                        {/* STATES COLUMN */}
                        <div className="w-56 p-2 border-r border-border">
                          {Object.keys(universities.australia.states).map(
                            (state) => (
                              <div
                                key={state}
                                onMouseEnter={() => setHoverState(state)}
                                className={`px-4 py-2 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${hoverState === state ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                              >
                                <span className="font-medium text-sm">
                                  {state}
                                </span>
                                <ChevronRight className="w-4 h-4 opacity-60" />
                              </div>
                            ),
                          )}
                        </div>

                        {/* UNIVERSITIES COLUMN */}
                        <div className="w-80 p-3">
                          {hoverState ? (
                            <ul className="space-y-1">
                              {universities.australia.states[hoverState].map(
                                (uni) => (
                                  <li key={uni.name}>
                                    <a
                                      href={uni.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
                                    >
                                      <span className="text-sm">
                                        {uni.name}
                                      </span>
                                      <ExternalLink className="w-4 h-4 opacity-40" />
                                    </a>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground px-4 py-2">
                              Hover over a state to view universities
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      /* NON-AUSTRALIA COUNTRIES */
                      <ul className="p-3 w-80 space-y-1">
                        {universities[openCountry].universities.map((uni) => (
                          <li key={uni.name}>
                            <a
                              href={uni.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                              <span className="text-sm">{uni.name}</span>
                              <ExternalLink className="w-4 h-4 opacity-40" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>,
                document.body,
              )}
          </section>

          {/* Stats Section */}
          <div className="mt-24 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
            <div className="relative text-center">
              <span className="bg-background px-6 text-lg font-medium">
                Our Impact
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-16 mt-10">
            <div className="flex flex-col items-center group">
              <div className="mb-3">
                <span className="text-5xl font-bold text-primary">2,600+</span>
              </div>
              <p className="text-base font-medium">Students Guided</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="mb-3">
                <span className="text-5xl font-bold text-primary">50+</span>
              </div>
              <p className="text-base font-medium">Partner Universities</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="mb-3">
                <span className="text-5xl font-bold text-primary">95%</span>
              </div>
              <p className="text-base font-medium">Success Rate</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="mb-3">
                <span className="text-5xl font-bold text-primary">15+</span>
              </div>
              <p className="text-base font-medium">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-now" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Apply for Education Counseling
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below and our education experts will get back
                to you within 24 hours.
              </p>
            </div>

            <Card className="border-border/40">
              <CardContent className="pt-6">
                {formSuccess ? (
                  <div className="p-6 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-2xl font-semibold">
                      Application Submitted!
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      Thank you for your interest. Our education counselor will
                      contact you shortly.
                    </p>
                    <Button onClick={() => setFormSuccess(false)}>
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullname"
                          className="text-sm font-medium"
                        >
                          Full Name *
                        </label>
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="johndoe@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contactNo"
                          className="text-sm font-medium"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="contactNo"
                          name="contactNo"
                          type="tel"
                          value={formData.contactNo}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="+1 123-456-7890"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="highestEducation"
                          className="text-sm font-medium"
                        >
                          Highest Education *
                        </label>
                        <input
                          id="highestEducation"
                          name="highestEducation"
                          type="text"
                          value={formData.highestEducation}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Bachelor's Degree in Computer Science"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Address *
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="123 Main St, City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="desiredCourse"
                          className="text-sm font-medium"
                        >
                          Desired Course *
                        </label>
                        <input
                          id="desiredCourse"
                          name="desiredCourse"
                          type="text"
                          value={formData.desiredCourse}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Master's in Data Science"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="preferredCountry"
                          className="text-sm font-medium"
                        >
                          Preferred Country *
                        </label>
                        <select
                          id="preferredCountry"
                          name="preferredCountry"
                          value={formData.preferredCountry}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Select a country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="preferredEducationType"
                          className="text-sm font-medium"
                        >
                          Education Type *
                        </label>
                        <select
                          id="preferredEducationType"
                          name="preferredEducationType"
                          value={formData.preferredEducationType}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Select education type</option>
                          {educationTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="resume" className="text-sm font-medium">
                          Upload Resume/CV *
                        </label>
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          onChange={handleFileChange}
                          required
                          accept=".pdf,.doc,.docx"
                          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        type="submit"
                        className="w-full md:w-auto px-8 py-6 bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground pt-4">
                      By submitting this form, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                      .
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section id="team" className="py-20">
        {(() => {
          const { ref, isVisible } = useInView<HTMLDivElement>();
          return (
            <div
              ref={ref}
              className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="text-center mb-16">
                <h2
                  className={`text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center ${
                    isVisible ? "animate-slide-up" : "opacity-0"
                  }`}
                >
                  <Users className="h-8 w-8 mr-2 text-accent" />
                  Meet Our Expert Consultants
                </h2>
                <p
                  className={`text-xl text-muted-foreground max-w-3xl mx-auto text-pretty ${
                    isVisible ? "animate-fade-in delay-100" : "opacity-0"
                  }`}
                >
                  Our certified recruitment professionals bring decades of
                  combined experience in connecting top talent with leading
                  organizations worldwide.
                </p>
              </div>

              <div className="flex justify-center">
                {recruitmentConsultants.map((consultant, index) => (
                  <Card
                    key={consultant.name}
                    className={`relative w-full max-w-sm bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      isVisible ? "animate-slide-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pt-8 pb-4">
                      <div className="flex justify-center">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10">
                          <img
                            src={consultant.photo}
                            alt={consultant.name}
                            className={`absolute inset-0 w-full h-full object-contain bg-white ${
                              isVisible ? "animate-scale-in" : "opacity-0"
                            }`}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <h3
                        className={`font-semibold text-lg ${
                          isVisible ? "animate-fade-in" : "opacity-0"
                        }`}
                      >
                        {consultant.name}
                      </h3>
                      <p
                        className={`text-sm text-muted-foreground mb-2 ${
                          isVisible ? "animate-fade-in delay-100" : "opacity-0"
                        }`}
                      >
                        {consultant.role}
                      </p>
                      <p
                        className={`text-sm text-pretty mb-2 ${
                          isVisible ? "animate-fade-in delay-200" : "opacity-0"
                        }`}
                      >
                        {consultant.description}
                      </p>
                      <p
                        className={`text-sm text-muted-foreground mb-2 ${
                          isVisible ? "animate-fade-in delay-300" : "opacity-0"
                        }`}
                      >
                        <strong>Email:</strong> {consultant.email}
                      </p>
                      <p
                        className={`text-sm text-muted-foreground mb-2 ${
                          isVisible ? "animate-fade-in delay-400" : "opacity-0"
                        }`}
                      >
                        <strong>Contact:</strong> {consultant.contactNumber}
                      </p>
                      <div
                        className={`flex flex-wrap gap-2 mt-2 justify-center ${
                          isVisible ? "animate-fade-in delay-500" : "opacity-0"
                        }`}
                      ></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Blog Section */}
      {blogs.length > 0 && (
        <BlogSection
          blogs={blogs}
          title="Educational Insights"
          subtitle="Stay updated with the latest information about the academic sector."
          linkPrefix="education/blogs"
        />
      )}

      {/* Call to action section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Educational Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our education experts are ready to guide you through every step of
              your academic journey. Get in touch today and let's make your
              educational dreams a reality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book-consultation">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service dialog */}
      {selectedService && (
        <ServiceDialog
          service={selectedService}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
