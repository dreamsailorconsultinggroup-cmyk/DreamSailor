import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export interface Blog {
  blogId: string;
  title: string;
  content: string;
  type?: string;
  createdAt: string;
}

interface BlogSectionProps {
  blogs: Blog[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  linkPrefix?: string;
}

export default function ApplicantSection({
  blogs,
  title = "Latest Blogs",
  subtitle = "Explore our latest articles and insights",
  icon = <FileText className="h-8 w-8 mr-2 text-blue-600" />,
  linkPrefix = "/blog"
}: BlogSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const truncateContent = (text: string, lines: number = 2) => {
    const words = text.split(" ");
    const maxWords = lines * 15;
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <section id="blogs" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            {icon}
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`
              }}
            >
              {blogs.map((post) => (
                <div
                  key={post.blogId}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full">
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {post.createdAt}
                      </p>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">
                        {truncateContent(post.content)}
                      </p>
                      <a
                        href={`${linkPrefix}/${post.blogId}`}
                        className="inline-block px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                      >
                        See Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}