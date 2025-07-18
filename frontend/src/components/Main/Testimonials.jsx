import { useState, useEffect } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Testimonials = () => {
  const { isDarkMode } = useAppContext();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      text: "Tranquilify has completely transformed how I approach my mental health. The mood tracking helps me identify patterns I never noticed before.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      text: "The breathing exercises have become part of my daily routine. It's incredible how just 5 minutes can change my entire day.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Teacher",
      text: "I love how the app gently encourages healthy habits without being overwhelming. The insights are genuinely helpful.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div>
      <section
        id="testimonials"
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-white/50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Loved by thousands of users
            </h2>
            <p
              className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join a community of people who have transformed their wellness journey with Tranquilify.
            </p>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={200}
            className={`relative rounded-2xl shadow-xl p-8 sm:p-12 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full p-3">
                <div className="text-white text-2xl">💬</div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>

              <blockquote
                className={`text-xl mb-8 leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonials[currentTestimonial].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className={`${isDarkMode ? "text-white" : "text-gray-600"} w-5 h-5`} />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentTestimonial
                        ? "bg-sky-500 w-6"
                        : isDarkMode
                        ? "bg-gray-600 w-2"
                        : "bg-gray-300 w-2"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <ChevronRight className={`${isDarkMode ? "text-white" : "text-gray-600"} w-5 h-5`} />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
