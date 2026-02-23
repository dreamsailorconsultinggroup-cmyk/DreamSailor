"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react"
import { toast } from "sonner" // optional if you use toast notifications

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSending, setIsSending] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    )

      console.log("Email sent:", result.text)
      toast.success("Message sent successfully! ")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error: any) {
      console.error("Email send error:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Address",
      details: ["Suite 1A, level 4, 17-21 University Ave", "Canberra 2601", "Australia"],
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: ["+61-406204071"],
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: ["enquiry@dsailorgroup.com.au"],
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat, Sun: Closed"],
    },
  ]

  const teamMembers = [
    {
      name: "Ibrahim Imad",
      position: "ADVISER & HOSPITALITY EXPERTISE MALDIVES",
      photo: "./team/Ibharim Imad.jpg",
    },
    {
      name: "Mohamed Riyaz",
      position: "BDH & CULINARY DIRECTOR MALDIVES",
      photo: "./team/Mohamed Riyaz.jpg",
    },
    {
      name: "Sanjay Udas",
      position: "MD & HEAD OF DIGITAL BRANDING KATHMANDU, NEPAL",
      photo: "./team/Sanjay Udas.jpg",
    },
    {
      name: "Shikhar Sjb Rana",
      position: "F&B HEAD KATHMANDU, NEPAL",
      photo: "./team/Shikhar Sjb Rana.jpg",
    },
    {
      name: "Sujan Maharjan",
      position: "CULINARY INCHARGE & CONSULTANT KRITIPUR, NEPAL",
      photo: "./team/Sujan Maharjan.jpg",
    },
  ]

  return (
    <>
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ready to start your journey? Contact us today and let's discuss how we can help you achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about how we can help you..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSending}>
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 mr-2 text-primary" />
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our dedicated professionals are here to support you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/40 hover:border-primary/30 p-0"
              >
                {/* Photo Container - Full width at top */}
                <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Info Container */}
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {member.name || "Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member.position || "Position"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}