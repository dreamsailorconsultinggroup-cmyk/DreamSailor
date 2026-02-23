import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Contact", href: "/contact" },
    {
      name: "Code of Conduct",
      href: "https://www.mara.gov.au/tools-for-agents-subsite/Files/code-of-conduct-march-2022.pdf",
    },
    {
      name: "Consumer Guide",
      href: "https://www.mara.gov.au/get-help-visa-subsite/FIles/consumer_guide_english.pdf",
    },
  ];

  const services = [
    { name: "Land & Homes", href: "/land-homes" },
    { name: "Recruitment", href: "/recruitment" },
    { name: "Business Events", href: "/business-events" },
    { name: "Education", href: "/education" },
    { name: "Visa & Migration", href: "/visa-migration" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/share/1ABk47qGZF/?mibextid=wwXIfr",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/dreamsailorconsulting?igsh=czFuNHB5dnhmOGM=",
    },
  ];

  return (
    <footer className={`bg-primary text-primary-foreground ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 animate-slide-left">
            <h3 className="text-2xl font-bold mb-4 animate-fade-in">
              Dream Sailor Consulting Pty Ltd
            </h3>
            <p className="text-primary-foreground/80 mb-6 text-pretty animate-fade-in delay-100">
              Empowering dreams and creating opportunities worldwide through our
              comprehensive real estate, recruitment, education, and migration
              services.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center animate-fade-in delay-200">
                <MapPin className="h-4 w-4 mr-2 animate-pulse" />
                <span>
                  Suite 1A, level 4, 17-21 University Ave, Canberra 2601
                </span>
              </div>
              <div className="flex items-center animate-fade-in delay-300">
                <Phone className="h-4 w-4 mr-2 animate-pulse" />
                <span> +61-406204071</span>
              </div>
              <div className="flex items-center animate-fade-in delay-400">
                <Mail className="h-4 w-4 mr-2 animate-pulse" />
                <span>enquiry@dsailorgroup.com.au</span>
              </div>
              <div className="flex items-center animate-fade-in delay-400">
                <ShieldCheck className="w-5 h-5" />
                <span>Registered MARA 2318244</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up">
            <h4 className="text-lg font-semibold mb-4 animate-fade-in">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li
                  key={link.name}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="animate-slide-up">
            <h4 className="text-lg font-semibold mb-4 animate-fade-in">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li
                  key={service.name}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={service.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="animate-slide-right">
            <h4 className="text-lg font-semibold mb-4 animate-fade-in">
              Connect With Us
            </h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-200 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5 animate-pulse" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/80 animate-fade-in delay-100">
              © 2025 Dream Sailor Consulting Pty Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
