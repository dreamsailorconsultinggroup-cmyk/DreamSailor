"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Briefcase,
  TrendingUp,
  DollarSign,
  Code,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import {
  Globe as GlobeIcon,
  Users,
  Star
} from "lucide-react";
import Link from "next/link";
import { InquiryTypeEnum } from "@/lib/enums/BusinessNEventsInquryTypeEnum";
import { useEffect, useState, ChangeEvent } from "react";
import { useBlogService } from "@/lib/blogService";

import BlogSection from "./ui/blog-card-view";
import { useInView } from "@/hooks/use-in-view";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

interface Consultant {
  name: string;
  role: string;
  description: string;
  photo: string;
  email: string;
  contactNumber: string;
}

// ------------------- Recruitment Data -------------------
const businessConsultants: Consultant[] = [
  {
    name: "Mr. Puskar Shrestha",
    role: "Co/Founder, Director",
    description:
      "A seasoned business leader with over a decade of experience in managing and advising organizations across multiple industries. Mr. Shrestha plays a key role in strategic planning, operational oversight, and investor-aligned business management, ensuring smooth execution of business initiatives and high-impact corporate events.",
    photo: "/Pushkar_Shrestha.png",
    email: "business@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
  {
    name: "Ms. Saglina Shrestha",
    role: "Founder/ Managing Director",
    description:
      "An accomplished business strategist and managing director with extensive experience in executive leadership and organizational growth. Ms. Shrestha oversees business development, high-level decision-making, and corporate event direction, helping organizations align their goals with measurable outcomes and long-term success.",
    photo: "/Salina_Shrestha.png",
    email: "business@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
  {
    name: "Mr. Nitesh Pokhrel",
    role: "Coporate GM",
    description:
      "A corporate operations specialist with strong expertise in business coordination and large-scale operational management. Mr. Pokhrel focuses on corporate governance, cross-functional execution, and business event facilitation, ensuring seamless coordination between stakeholders, partners, and operational teams.",
    photo: "/nitesh pokhrel.png",
    email: "business@dsailorgroup.com.au",
    contactNumber: "+61-406204071",
  },
];

export function BusinessEventsSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    inquiryType: "",
    organizationName: "",
    eventDate: "",
    budgetRange: "",
    message: "",
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { getBlogByService } = useBlogService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      const { businessEventsService } = await import(
        "@/lib/businessEventsService"
      );
      const result = await businessEventsService.submitApplication(formData);

      if (result.success) {
        setFormSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          inquiryType: "",
          organizationName: "",
          eventDate: "",
          budgetRange: "",
          message: "",
        });
      } else {
        throw new Error(result.errorMessage || "Failed to submit inquiry");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      id: 1,
      title: "Business Micro-Management",
      description:
        "Comprehensive day-to-day business operations management tailored to your specific needs",
      icon: Briefcase,
      features: [
        "Operations oversight",
        "Process optimization",
        "Performance monitoring",
      ],
    },
    {
      id: 2,
      title: "Staffing Solutions",
      description:
        "Expert recruitment and workforce management to build your ideal team",
      icon: Users,
      features: ["Talent acquisition", "HR management", "Training programs"],
    },
    {
      id: 3,
      title: "Business Buying & Selling",
      description:
        "Professional brokerage services for acquiring or selling your business",
      icon: TrendingUp,
      features: [
        "Business valuation",
        "Negotiation support",
        "Transaction management",
      ],
    },
    {
      id: 4,
      title: "Business Capital Financing",
      description:
        "Arrange operational capital and business loans to fuel your growth",
      icon: DollarSign,
      features: ["Loan arrangement", "Capital sourcing", "Financial planning"],
    },
    {
      id: 5,
      title: "Digital Marketing",
      description:
        "Strategic digital marketing campaigns to amplify your brand presence",
      icon: Megaphone,
      features: [
        "SEO optimization",
        "Social media marketing",
        "Content strategy",
      ],
    },
    {
      id: 6,
      title: "Web Development",
      description:
        "Custom web solutions to establish and enhance your online presence",
      icon: Code,
      features: ["Website design", "E-commerce solutions", "Web applications"],
    },
    {
      id: 7,
      title: "Investor-Led Management",
      description:
        "Run your business operations as required by investors with professional oversight",
      icon: CheckCircle2,
      features: [
        "Compliance management",
        "Reporting systems",
        "Strategic alignment",
      ],
    },
    {
      id: 8,
      title: "Event Management",
      description:
        "Professional planning and execution of business events and corporate functions",
      icon: Calendar,
      features: ["Event planning", "Venue coordination", "Guest management"],
    },
  ];

  const partnerSites = [
    { name: "Jack Hospitality", url: "jackhospitality.com.au" },
    { name: "Commercial Property", url: "commercialproperty.com.au" },
    { name: "GSE Hospitality Broker", url: "gsehospitalitybroker.com.au" },
    { name: "Hospitality Management", url: "hospitalitymanagement.com.au" },
  ];

  const fetchBlogs = async () => {
    try {
      const response = await getBlogByService("Business_and_Events");

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

  return (
    <>
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-scale-in">
          <img
            src="/decorated-banquet-hall-with-flowers.jpg"
            alt="Business management"
            className="w-full h-full object-cover animate-fade-in scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-primary/70 animate-fade-in"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance animate-fade-in">
            Your Business, <span className="text-secondary">Our Expertise</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-100">
            We don't just guide your business—we actively manage and run it with
            a team of dedicated experts across every aspect of operations
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-150">
            <Link href="#business-services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white hover:border-white/50"
              >
                Explore Services
              </Button>
            </Link>
            <Link href="#business-events-form">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Get Started
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
              <span className="font-medium text-white">500+</span> businesses
              managed
            </span>
          </div>
        </div>
      </section>

      <section id="business-services" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comprehensive Business Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              From micro-managing daily operations to arranging business loans
              and executing strategic initiatives, we provide end-to-end
              business management solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {service.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" id="business-events-form">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Start Your Business Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need micro-management support, staffing solutions, or
              help buying and selling a business, we're here to help
            </p>
          </div>

          <Card className="border-border/40">
            <CardContent className="pt-6">
              {formSuccess ? (
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    Inquiry Submitted!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you! Our team will get back to you shortly.
                  </p>
                  <Button onClick={() => setFormSuccess(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <div onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-md border border-border"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-md border border-border"
                        placeholder="johndoe@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Phone Number *
                      </label>
                      <input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-md border border-border"
                        placeholder="+1 123-456-7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-md border border-border"
                        required
                      >
                        <option value="">Select service type</option>
                        {Object.values(InquiryTypeEnum).map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">
                        Organization Name
                      </label>
                      <input
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-md border border-border"
                        placeholder="Company / Group Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Preferred Start Date
                      </label>
                      <input
                        name="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-md border border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Budget Range
                      </label>
                      <input
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-md border border-border"
                        placeholder="$1000 - $5000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 rounded-md border border-border h-32"
                      placeholder="Tell us about your business needs and how we can help..."
                    />
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="px-8 py-6 w-full md:w-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businessConsultants.map((consultant, index) => (
                  <Card
                    key={consultant.name}
                    className={`relative bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
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
                            className={`w-full h-full object-contain bg-white ${
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {blogs.length > 0 && (
        <BlogSection
          blogs={blogs}
          title="Business Insights & Success Stories"
          subtitle="Learn from our expertise and explore proven strategies for business success"
          linkPrefix="/business-events/blogs"
        />
      )}
    </>
  );
}
