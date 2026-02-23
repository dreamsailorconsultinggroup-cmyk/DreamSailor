"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  Users,
  Plane,
  Globe,
  Briefcase,
  Heart,
  DollarSign,
  Star,
  ExternalLink,
  Award,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  ChevronDown,
  Calculator,
  CreditCard,
  Search,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useBlogService } from "@/lib/blogService";
import { useInView } from "@/hooks/use-in-view";
import BlogSection from "./ui/blog-card-view";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

interface VisaCategory {
  category: string;
  description: string;
  visas: {
    subclass: string;
    name: string;
    description: string;
    duration?: string;
  }[];
}

export function VisaMigrationSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visaFinderSlide, setVisaFinderSlide] = useState(0);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const { getBlogByService } = useBlogService();

  const steps = [
    {
      step: 1,
      title: "Initial Consultation",
      description:
        "Free assessment of your eligibility and discussion of your migration goals to Australia.",
      icon: (
        <Users className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
      ),
    },
    {
      step: 2,
      title: "Documentation",
      description:
        "Comprehensive assistance with gathering and preparing all required documents for Australian immigration.",
      icon: (
        <FileText className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
      ),
    },
    {
      step: 3,
      title: "Application Processing",
      description:
        "Expert handling of your Australian visa application with regular updates on progress.",
      icon: (
        <CheckCircle className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
      ),
    },
    {
      step: 4,
      title: "Approval & Travel",
      description:
        "Final approval assistance and pre-departure support for your journey to Australia.",
      icon: (
        <Plane className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
      ),
    },
  ];

  const visaTypes = [
    {
      title: "Student Visa",
      description:
        "For international students pursuing education in Australia and abroad",
      countries: ["Australia", "USA", "Canada", "UK"],
      processingTime: "4-8 weeks",
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
    {
      title: "Work Visa",
      description:
        "For professionals seeking employment opportunities in Australia and globally",
      countries: ["Australia", "Germany", "Netherlands"],
      processingTime: "6-12 weeks",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
    {
      title: "Family Visa",
      description: "For family reunification and dependent visas in Australia",
      countries: ["Australia"],
      processingTime: "8-16 weeks",
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
    {
      title: "Investment Visa",
      description:
        "For investors and entrepreneurs looking to migrate to Australia",
      countries: ["Australia"],
      processingTime: "12-24 weeks",
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
  ];

  const visaFinderCategories = [
    {
      title: "Visit and Tourism",
      icon: <Plane className="h-8 w-8 text-accent" />,
      description: "Short-term stays for holidays, visiting family, or business",
      visas: [
        { name: "Visitor Visa (600)", desc: "Tourism, family visits, business purposes" },
        { name: "eVisitor (651)", desc: "Free for European passport holders" },
        { name: "ETA (601)", desc: "Electronic travel authority" },
      ],
    },
    {
      title: "Study",
      icon: <Globe className="h-8 w-8 text-accent" />,
      description: "Study at Australian educational institutions",
      visas: [
        { name: "Student Visa (500)", desc: "Full-time study at registered institutions" },
        { name: "Student Guardian (590)", desc: "For guardians of students under 18" },
        { name: "Graduate Visa (485)", desc: "Work after graduation" },
      ],
    },
    {
      title: "Work",
      icon: <Briefcase className="h-8 w-8 text-accent" />,
      description: "Temporary or permanent work opportunities",
      visas: [
        { name: "Skilled Independent (189)", desc: "Points-based permanent visa" },
        { name: "TSS Visa (482)", desc: "Employer-sponsored temporary work" },
        { name: "Working Holiday (417/462)", desc: "Work and travel for young people" },
      ],
    },
    {
      title: "Live Permanently",
      icon: <Award className="h-8 w-8 text-accent" />,
      description: "Permanent residency and citizenship pathways",
      visas: [
        { name: "Skilled Migration (189/190)", desc: "Permanent skilled worker visas" },
        { name: "Regional Visa (191)", desc: "Permanent residency via regional work" },
        { name: "Business Talent (132/888)", desc: "For business owners and investors" },
      ],
    },
    {
      title: "Join Partner or Family",
      icon: <Heart className="h-8 w-8 text-accent" />,
      description: "Reunite with family members in Australia",
      visas: [
        { name: "Partner Visa (820/801)", desc: "For spouses and de facto partners" },
        { name: "Parent Visa (103/143)", desc: "For parents of Australian citizens" },
        { name: "Child Visa (101/802)", desc: "For dependent children" },
      ],
    },
    {
      title: "Stay Longer in Australia",
      icon: <FileText className="h-8 w-8 text-accent" />,
      description: "Extend your current visa or change visa type",
      visas: [
        { name: "Visa Extensions", desc: "Extend visitor or student visas" },
        { name: "Bridging Visas", desc: "Stay while waiting for new visa" },
        { name: "Pathway to PR", desc: "Transition from temporary to permanent" },
      ],
    },
  ];

  const skilledVisaTypes = [
    {
      subclass: "189",
      title: "Skilled Independent Visa",
      description:
        "A points-based permanent residency visa for skilled workers who are not sponsored by an employer, state, or family member.",
      features: [
        "No employer sponsorship required",
        "Permanent residency from day one",
        "Work and live anywhere in Australia",
        "Include family members in your application",
        "Pathway to Australian citizenship",
      ],
      icon: <Award className="h-6 w-6" />,
    },
    {
      subclass: "190",
      title: "Skilled Nominated Visa",
      description:
        "A points-based permanent residency visa for skilled workers nominated by an Australian state or territory government.",
      features: [
        "Additional 5 points for state nomination",
        "Permanent residency pathway",
        "Access to Medicare and social services",
        "Pathway to Australian citizenship",
        "Must live in nominating state for 2 years",
      ],
      icon: <Globe className="h-6 w-6" />,
    },
    {
      subclass: "489",
      title: "Skilled Regional (Provisional) Visa",
      description:
        "A provisional visa for skilled workers willing to live and work in regional Australia (Note: Now replaced by subclass 491, but existing holders can apply for 887).",
      features: [
        "4-year provisional visa",
        "Sponsored by state/territory or family",
        "Live and work in regional Australia",
        "Pathway to permanent residency (subclass 887)",
        "Include family members",
      ],
      icon: <Star className="h-6 w-6" />,
    },
    {
      subclass: "491",
      title: "Skilled Work Regional (Provisional) Visa",
      description:
        "A 5-year provisional visa for skilled workers willing to live and work in regional Australia, nominated by a state/territory or sponsored by an eligible family member.",
      features: [
        "5-year provisional visa",
        "15 points for regional nomination",
        "Live, work and study in regional Australia",
        "Pathway to permanent residency (subclass 191)",
        "Access to Medicare",
        "Include family members",
      ],
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      subclass: "191",
      title: "Permanent Residence (Skilled Regional) Visa",
      description:
        "A permanent residency visa for holders of subclass 491 or 494 visas who have lived and worked in regional Australia for at least 3 years.",
      features: [
        "Permanent residency status",
        "For subclass 491/494 visa holders",
        "Must have lived in regional Australia for 3 years",
        "Meet minimum income requirement",
        "Live anywhere in Australia after grant",
        "Pathway to Australian citizenship",
      ],
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  // Comprehensive visa listing data based on official Australian immigration categories
  const visaCategories: VisaCategory[] = [
    {
      category: "Visitor Visas",
      description: "Short-term visas for tourism, business visits, or visiting family and friends",
      visas: [
        {
          subclass: "600",
          name: "Visitor Visa",
          description: "For tourism, visiting family or business purposes",
          duration: "3-12 months",
        },
        {
          subclass: "601",
          name: "Electronic Travel Authority (ETA)",
          description: "Electronic visa for eligible passport holders",
          duration: "Up to 3 months per visit",
        },
        {
          subclass: "651",
          name: "eVisitor",
          description: "Free electronic visa for European passport holders",
          duration: "Up to 3 months per visit",
        },
        {
          subclass: "771",
          name: "Transit Visa",
          description: "For transiting through Australia",
          duration: "Up to 72 hours",
        },
      ],
    },
    {
      category: "Student Visas",
      description: "Visas for international students and their guardians",
      visas: [
        {
          subclass: "500",
          name: "Student Visa",
          description: "For full-time study at an Australian educational institution",
          duration: "Duration of course",
        },
        {
          subclass: "590",
          name: "Student Guardian Visa",
          description: "For guardians of students under 18",
          duration: "Duration of student's course",
        },
        {
          subclass: "485",
          name: "Temporary Graduate Visa",
          description: "For recent graduates to work in Australia",
          duration: "18 months to 4 years",
        },
        {
          subclass: "476",
          name: "Skilled Recognised Graduate Visa",
          description: "For recent engineering graduates",
          duration: "Up to 18 months",
        },
      ],
    },
    {
      category: "Skilled Work Visas",
      description: "Visas for skilled workers based on points-tested or employer-sponsored pathways",
      visas: [
        {
          subclass: "189",
          name: "Skilled Independent Visa",
          description: "Points-based permanent visa without sponsorship",
          duration: "Permanent",
        },
        {
          subclass: "190",
          name: "Skilled Nominated Visa",
          description: "Points-based visa with state nomination",
          duration: "Permanent",
        },
        {
          subclass: "491",
          name: "Skilled Work Regional (Provisional) Visa",
          description: "For skilled workers in regional areas",
          duration: "5 years",
        },
        {
          subclass: "191",
          name: "Permanent Residence (Skilled Regional) Visa",
          description: "For subclass 491/494 holders after 3 years",
          duration: "Permanent",
        },
        {
          subclass: "482",
          name: "Temporary Skill Shortage Visa",
          description: "Employer-sponsored temporary work visa",
          duration: "Up to 4 years",
        },
        {
          subclass: "186",
          name: "Employer Nomination Scheme",
          description: "Employer-sponsored permanent residency",
          duration: "Permanent",
        },
        {
          subclass: "494",
          name: "Skilled Employer Sponsored Regional (Provisional) Visa",
          description: "Employer-sponsored visa for regional areas",
          duration: "5 years",
        },
      ],
    },
    {
      category: "Family & Partner Visas",
      description: "Visas for family reunification and partners of Australian citizens or residents",
      visas: [
        {
          subclass: "300",
          name: "Prospective Marriage Visa",
          description: "For fiancés of Australian citizens/residents",
          duration: "9-15 months",
        },
        {
          subclass: "309/100",
          name: "Partner Visa (Offshore)",
          description: "Two-stage visa for partners living offshore",
          duration: "Temporary then Permanent",
        },
        {
          subclass: "820/801",
          name: "Partner Visa (Onshore)",
          description: "Two-stage visa for partners in Australia",
          duration: "Temporary then Permanent",
        },
        {
          subclass: "101",
          name: "Child Visa (Offshore)",
          description: "For dependent children outside Australia",
          duration: "Permanent",
        },
        {
          subclass: "802",
          name: "Child Visa (Onshore)",
          description: "For dependent children in Australia",
          duration: "Permanent",
        },
        {
          subclass: "103",
          name: "Parent Visa",
          description: "For parents of Australian citizens/residents",
          duration: "Permanent",
        },
        {
          subclass: "143",
          name: "Contributory Parent Visa",
          description: "Faster parent visa with higher fees",
          duration: "Permanent",
        },
        {
          subclass: "173",
          name: "Contributory Parent (Temporary) Visa",
          description: "Temporary parent visa pathway",
          duration: "2 years",
        },
        {
          subclass: "116",
          name: "Carer Visa",
          description: "For carers of Australian residents with medical needs",
          duration: "Permanent",
        },
      ],
    },
    {
      category: "Business & Investment Visas",
      description: "Visas for business owners, investors, and entrepreneurs",
      visas: [
        {
          subclass: "188",
          name: "Business Innovation and Investment (Provisional) Visa",
          description: "Provisional visa for business owners and investors",
          duration: "4-5 years",
        },
        {
          subclass: "888",
          name: "Business Innovation and Investment (Permanent) Visa",
          description: "Permanent visa for subclass 188 holders",
          duration: "Permanent",
        },
        {
          subclass: "132",
          name: "Business Talent Visa",
          description: "For high-calibre business people",
          duration: "Permanent",
        },
      ],
    },
    {
      category: "Work & Holiday Visas",
      description: "Visas for young people to work and travel in Australia",
      visas: [
        {
          subclass: "417",
          name: "Working Holiday Visa",
          description: "For citizens of eligible countries aged 18-30",
          duration: "12 months (extendable)",
        },
        {
          subclass: "462",
          name: "Work and Holiday Visa",
          description: "For citizens of Work and Holiday agreement countries",
          duration: "12 months (extendable)",
        },
      ],
    },
    {
      category: "Other Temporary Visas",
      description: "Various temporary visas for specific purposes",
      visas: [
        {
          subclass: "400",
          name: "Temporary Work (Short Stay Specialist) Visa",
          description: "For short-term highly specialized work",
          duration: "Up to 6 months",
        },
        {
          subclass: "408",
          name: "Temporary Activity Visa",
          description: "For specific temporary activities",
          duration: "Varies by activity",
        },
        {
          subclass: "444",
          name: "Special Category Visa (SCV)",
          description: "Automatic visa for New Zealand citizens",
          duration: "Indefinite while NZ citizen",
        },
      ],
    },
    {
      category: "Humanitarian & Protection Visas",
      description: "Visas for refugees and those seeking protection",
      visas: [
        {
          subclass: "200",
          name: "Refugee Visa",
          description: "For refugees outside Australia",
          duration: "Permanent",
        },
        {
          subclass: "202",
          name: "Global Special Humanitarian Visa",
          description: "For those in humanitarian need outside Australia",
          duration: "Permanent",
        },
        {
          subclass: "866",
          name: "Protection Visa",
          description: "For people seeking protection in Australia",
          duration: "Permanent or temporary",
        },
      ],
    },
  ];

  const fetchBlogs = async () => {
    try {
      const response = await getBlogByService("Migration_and_Visa");

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % skilledVisaTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + skilledVisaTypes.length) % skilledVisaTypes.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextVisaFinderSlide = () => {
    setVisaFinderSlide((prev) => (prev + 1) % visaFinderCategories.length);
  };

  const prevVisaFinderSlide = () => {
    setVisaFinderSlide(
      (prev) => (prev - 1 + visaFinderCategories.length) % visaFinderCategories.length,
    );
  };

  const goToVisaFinderSlide = (index: number) => {
    setVisaFinderSlide(index);
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-20 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 animate-scale-in">
          <img
            src="/australia.jpg"
            alt="Australia Migration"
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-primary/70 animate-fade-in"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance animate-fade-in">
            Your Australian <span className="text-secondary">Dream</span> Starts
            Here
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-100">
            Navigate your path to Australia with our expert visa and migration
            services designed to make your dreams a reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-150">
            <Link href="/book-consultation">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-3 animate-pulse-slow"
              >
                Free Assessment
                <Globe className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#skilled-migration">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white hover:border-white/50"
              >
                Skilled Migration
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center space-x-3 justify-center animate-fade-in-up delay-200">
            <span className="text-sm text-white/80">
              <span className="font-medium text-white">2000+</span> successful
              visa applications to Australia
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="visa-migration" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4 tracking-tight flex items-center justify-center">
              <Globe className="h-8 w-8 mr-2 text-accent" />
              Australian Visa & Migration Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Embark on your journey to Australia with our expert visa and
              migration services, tailored to make your dreams a reality with
              DreamSailor.
            </p>
          </div>

          {/* Visa Fees and Pricing Information Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-primary flex items-center justify-center">
              <CreditCard className="h-6 w-6 mr-2 text-accent" />
              Visa Fees & Charges
            </h3>
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`max-w-5xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                >
                  <Card className="border-2 border-primary/20 shadow-lg mb-6">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary flex items-center">
                        <Info className="h-6 w-6 mr-2" />
                        Understanding Visa Application Charges
                      </CardTitle>
                      <CardDescription className="text-base">
                        Official information from the Australian Department of Home Affairs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        The cost of visas changes from time to time. The cost of your visa is dependent on the date we receive your application. If there is a price increase between the date you lodge your application and the date we receive your application, you will need to pay the new application charge.
                      </p>
                      <div className="bg-accent/10 p-4 rounded-lg">
                        <p className="font-semibold text-primary mb-2">Important Note:</p>
                        <p className="text-sm text-muted-foreground">
                          The visa application charge is the amount of money in Australian dollars (AUD) that must be paid for a visa application. In some cases the visa application charge is nil. A surcharge may apply when paying by credit card or PayPal.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-primary mb-1">Visa Pricing Categories</h4>
                            <p className="text-sm text-muted-foreground">
                              Visit, Study, Work, Live, Other, and Repealed/Closed visas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                          <Calculator className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-primary mb-1">Pricing Estimator</h4>
                            <p className="text-sm text-muted-foreground">
                              Use the official estimator to calculate your visa costs
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-4">
                        <a
                          href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="bg-primary hover:bg-primary/90 text-white">
                            View Current Pricing Table
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://immi.homeaffairs.gov.au/visas/visa-pricing-estimator"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Use Pricing Estimator
                            <Calculator className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </div>

          {/* Visa Finder Section with Slider */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-primary flex items-center justify-center">
              <Search className="h-6 w-6 mr-2 text-accent" />
              Find Your Visa
            </h3>
            <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore visa options based on what you want to do in Australia
            </p>
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`relative max-w-6xl mx-auto ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${visaFinderSlide * 100}%)`,
                      }}
                    >
                      {visaFinderCategories.map((category, index) => (
                        <div
                          key={index}
                          className="w-full flex-shrink-0 px-4"
                        >
                          <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 max-w-3xl mx-auto">
                            <CardHeader>
                              <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4 mx-auto">
                                {category.icon}
                              </div>
                              <CardTitle className="text-2xl text-primary text-center">
                                {category.title}
                              </CardTitle>
                              <CardDescription className="text-center text-base">
                                {category.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="space-y-3">
                                {category.visas.map((visa, idx) => (
                                  <div
                                    key={idx}
                                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                  >
                                    <p className="font-semibold text-sm text-primary mb-1">
                                      {visa.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {visa.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <Link href="/book-consultation">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                                  Get Expert Consultation
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevVisaFinderSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                    aria-label="Previous visa category"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextVisaFinderSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                    aria-label="Next visa category"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-8">
                    {visaFinderCategories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToVisaFinderSlide(index)}
                        className={`h-3 rounded-full transition-all ${
                          visaFinderSlide === index
                            ? "w-8 bg-primary"
                            : "w-3 bg-primary/30 hover:bg-primary/50"
                        }`}
                        aria-label={`Go to ${visaFinderCategories[index].title}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Comprehensive Visa Listing with Dropdown */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-4 text-primary flex items-center justify-center">
              <FileText className="h-6 w-6 mr-2 text-accent" />
              Complete Visa List
            </h3>
            <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
              Browse all available Australian visa types organized by category. Click on any category to view specific visa subclasses.
            </p>
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`max-w-6xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visaCategories.map((category, index) => (
                      <Card
                        key={category.category}
                        className={`border-2 border-primary/10 shadow-md hover:shadow-lg transition-all ${
                          isVisible ? "animate-slide-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Collapsible
                          open={openCategories.includes(category.category)}
                          onOpenChange={() => toggleCategory(category.category)}
                        >
                          <CollapsibleTrigger className="w-full">
                            <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="text-left flex-1">
                                  <CardTitle className="text-lg text-primary mb-1">
                                    {category.category}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    {category.description}
                                  </CardDescription>
                                </div>
                                <ChevronDown
                                  className={`h-5 w-5 text-primary transition-transform duration-200 flex-shrink-0 ml-2 ${
                                    openCategories.includes(category.category)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                {category.visas.map((visa) => (
                                  <div
                                    key={visa.subclass}
                                    className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-primary/10"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge className="bg-primary text-white text-xs">
                                            {visa.subclass}
                                          </Badge>
                                          {visa.duration && (
                                            <Badge variant="outline" className="text-xs">
                                              {visa.duration}
                                            </Badge>
                                          )}
                                        </div>
                                        <h5 className="font-semibold text-sm text-primary mb-1">
                                          {visa.name}
                                        </h5>
                                        <p className="text-xs text-muted-foreground">
                                          {visa.description}
                                        </p>
                                      </div>
                                      <Link href="/book-consultation">
                                        <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">
                                          Info
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      For the most up-to-date and complete official visa listing, visit the Department of Home Affairs
                    </p>
                    <a
                      href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        Visit Official Visa Listing
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Our Process Section - Timeline Style */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary flex items-center justify-center">
              <CheckCircle className="h-6 w-6 mr-2 text-accent" />
              Our Seamless Process
            </h3>
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`relative ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step, index) => (
                      <div
                        key={step.step}
                        className={`group relative flex items-center ${
                          index % 2 === 0
                            ? "md:justify-end"
                            : "md:justify-start"
                        } mb-8 md:mb-12`}
                      >
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full"></div>
                        <Card
                          className={`w-full md:w-5/12 bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ${
                            isVisible ? "animate-slide-up" : "opacity-0"
                          }`}
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              {step.icon}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-primary mb-2">
                                {step.title}
                              </h4>
                              <p className="text-sm text-muted-foreground text-pretty">
                                {step.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Visa Types Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 mr-2 text-accent" />
              Visa Types We Handle
            </h3>
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  {visaTypes.map((visa, index) => (
                    <Card
                      key={index}
                      className={`bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                        isVisible ? "animate-slide-up" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {visa.icon}
                          <CardTitle className="text-xl text-primary">
                            {visa.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-pretty text-muted-foreground">
                          {visa.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-sm mb-2 text-foreground">
                              Destinations:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {visa.countries.map((country) => (
                                <Badge
                                  key={country}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary text-xs"
                                >
                                  {country}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Processing Time:
                            </span>
                            <span className="font-semibold text-primary">
                              {visa.processingTime}
                            </span>
                          </div>
                          <Link href="/book-consultation">
                            <Button className="w-full bg-primary hover:bg-blue-900 text-white transition-all">
                              Get Started
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Australian Skilled Migration Section with Slider */}
          <section
            id="skilled-migration"
            className="py-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl"
          >
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
                      <Star className="h-8 w-8 mr-2 text-accent" />
                      Australian Skilled Migration Program
                    </h2>
                    <p
                      className={`text-xl text-muted-foreground max-w-3xl mx-auto text-pretty ${
                        isVisible ? "animate-fade-in delay-100" : "opacity-0"
                      }`}
                    >
                      Unlock your pathway to permanent residency in Australia
                      through our expert skilled migration services with
                      DreamSailor.
                    </p>
                  </div>

                  {/* Visa Types Slider */}
                  <div className="relative mb-12">
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                      >
                        {skilledVisaTypes.map((visa, index) => (
                          <div
                            key={index}
                            className="w-full flex-shrink-0 px-4"
                          >
                            <Card className="border-2 border-primary/20 shadow-xl max-w-4xl mx-auto">
                              <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className="bg-primary text-white text-lg px-4 py-1">
                                    Subclass {visa.subclass}
                                  </Badge>
                                  <div className="text-primary">
                                    {visa.icon}
                                  </div>
                                </div>
                                <CardTitle className="text-2xl text-primary">
                                  {visa.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-muted-foreground text-lg">
                                  {visa.description}
                                </p>
                                <div className="pt-4">
                                  <h4 className="font-semibold text-lg mb-4 text-primary">
                                    Key Features:
                                  </h4>
                                  <ul className="space-y-3">
                                    {visa.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start"
                                      >
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">
                                          {feature}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="pt-6">
                                  <Link href="/book-consultation">
                                    <div className="flex justify-center">
                                      <Button className="w-64 bg-primary hover:bg-primary/90 text-white">
                                        Get Expert Consultation
                                      </Button>
                                    </div>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                      {skilledVisaTypes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`h-3 rounded-full transition-all ${
                            currentSlide === index
                              ? "w-8 bg-primary"
                              : "w-3 bg-primary/30 hover:bg-primary/50"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Points Calculator Link */}
                  <div className="max-w-4xl mx-auto">
                    <Card className="border-2 border-accent/30 bg-white shadow-xl mb-8">
                      <CardHeader>
                        <CardTitle className="text-2xl text-primary flex items-center justify-center">
                          <Calculator className="h-6 w-6 mr-2" />
                          Official Points Calculator
                        </CardTitle>
                        <CardDescription className="text-center text-lg">
                          Calculate your exact points for Australian skilled migration
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                          Use the official Australian Department of Home Affairs Points Calculator to determine your eligibility for skilled migration visas. This tool helps you understand how many points you can claim based on your age, English proficiency, work experience, qualifications, and other factors.
                        </p>
                        <a
                          href="https://immi.homeaffairs.gov.au/help-support/departmental-forms/online-forms/points-calculator"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                            Launch Points Calculator
                            <ExternalLink className="ml-2 h-5 w-5" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="max-w-5xl mx-auto">
                    <Card className="border-2 border-accent/30 bg-white shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-2xl text-primary flex items-center justify-center">
                          <Star className="h-6 w-6 mr-2" />
                          Points Assessment System
                        </CardTitle>
                        <CardDescription className="text-center text-lg">
                          Understanding your eligibility for Australian skilled migration
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-primary">
                              Key Factors:
                            </h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Age
                                </Badge>
                                <span>25-32 years (maximum points)</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  English
                                </Badge>
                                <span>Superior English (IELTS 8.0+)</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Experience
                                </Badge>
                                <span>8+ years skilled employment</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Education
                                </Badge>
                                <span>Australian degree or equivalent</span>
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-primary">
                              Additional Points:
                            </h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Partner
                                </Badge>
                                <span>Skilled partner (5-10 points)</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  State
                                </Badge>
                                <span>State nomination (5 points)</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Regional
                                </Badge>
                                <span>Regional study/work (5-15 points)</span>
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  STEM
                                </Badge>
                                <span>STEM qualification (10 points)</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 p-6 bg-primary/5 rounded-lg text-center">
                          <p className="text-lg font-semibold text-primary mb-2">
                            Minimum Points Required: 65
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Higher points increase your chances of receiving an
                            invitation
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Success Record Section */}
          <div className="mt-16 bg-primary text-white rounded-2xl p-8">
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Our Success Record
                    </h3>
                    <p className="text-white/80 text-lg">
                      Trusted by thousands of clients seeking Australian
                      migration
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                      { value: "98%", label: "Approval Rate" },
                      { value: "2,000+", label: "Visas Processed" },
                      { value: "15+", label: "Years Experience" },
                      { value: "500+", label: "Happy Clients" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className={`${
                          isVisible ? "animate-slide-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-4xl font-bold mb-2 animate-pulse">
                          {stat.value}
                        </div>
                        <div className="text-sm text-white/80">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Consultant Info Section */}
          <section id="consultant-info" className="py-20">
            {(() => {
              const { ref, isVisible } = useInView<HTMLDivElement>();
              return (
                <div
                  ref={ref}
                  className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                >
                  <div className="text-center mb-12">
                    <h2
                      className={`text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center ${
                        isVisible ? "animate-slide-up" : "opacity-0"
                      }`}
                    >
                      <Users className="h-8 w-8 mr-2 text-accent" />
                      Meet Our Expert Consultant
                    </h2>
                    <p
                      className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
                        isVisible ? "animate-fade-in delay-100" : "opacity-0"
                      }`}
                    >
                      Our MARA registered migration agent is here to guide you
                      through your Australian visa journey
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Card
                      className={`max-w-2xl w-full bg-white border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        isVisible ? "animate-slide-up" : "opacity-0"
                      }`}
                    >
                      <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
                        {/* Image Section */}
                        <div className="flex justify-center md:justify-start">
                          <div className="relative w-48 h-48 md:w-full md:h-full rounded-lg overflow-hidden bg-muted border-2 border-primary/10">
                            <img
                              src="/team/Lilash Yadav.jpeg"
                              alt="Lilash Yadav"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col justify-center text-center md:text-left space-y-3">
                          <div>
                            <h3 className="text-2xl font-bold text-primary mb-1">
                              Lilash Yadav
                            </h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                              <Badge className="bg-accent text-white">
                                MARA Registered
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-primary text-primary"
                              >
                                2318244
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start justify-center md:justify-start gap-2">
                              <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <a
                                href="mailto:dreamsailor@4acs.com.au"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                dreamsailor@4acs.com.au
                              </a>
                            </div>

                            <div className="flex items-start justify-center md:justify-start gap-2">
                              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <div className="text-muted-foreground">
                                <p>Level 4, 17-21 University Avenue</p>
                                <p>ACT 2601, Australia</p>
                              </div>
                            </div>

                            <div className="flex items-start justify-center md:justify-start gap-2">
                              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <div className="text-muted-foreground">
                                <p>Level 6, 379-383 Pitt Street</p>
                                <p>Sydney 2000, Australia</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Link href="/book-consultation">
                              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white">
                                Book Consultation
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })()}
          </section>

          {blogs.length > 0 && (
            <BlogSection
              blogs={blogs}
              title="Australian Visa & Migration Insights"
              subtitle="Stay updated with the latest Australian visa and migration tips."
              linkPrefix="/visa-migration/blogs"
            />
          )}
        </div>
      </section>
    </>
  );
}