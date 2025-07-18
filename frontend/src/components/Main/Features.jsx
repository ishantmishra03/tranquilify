import React from "react";
import { HabitIcon, JournalIcon, MoodIcon, TherapistIcon } from "./CustomIcons";
import { ScrollReveal } from "./ScrollReveal";
import { useAppContext } from "../../context/AppContext";

const Features = () => {
  const { isDarkMode } = useAppContext();

  const features = [
    {
      icon: <MoodIcon className="w-12 h-12" />,
      title: "Wellness Tracking",
      description:
        "Monitor your overall well-being with comprehensive insights that encompass emotional, physical, and mental health.",
    },
    {
      icon: <HabitIcon className="w-12 h-12" />,
      title: "Goal Setting & Progress",
      description:
        "Set meaningful personal goals and track your progress with clear milestones to inspire continuous growth.",
    },
    {
      icon: <TherapistIcon className="w-12 h-12" />,
      title: "AI Therapist",
      description:
        "Engage in confidential, compassionate conversations with an AI designed to support your emotional well-being.",
    },
    {
      icon: <JournalIcon className="w-12 h-12" />,
      title: "Smart Journal",
      description:
        "Reflect deeply with AI-powered sentiment analysis that helps uncover patterns in your thoughts and feelings.",
    },
  ];

  return (
    <div>
      <section
        id="features"
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-white/50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Everything you need for
              <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                {" "}
                better wellness
              </span>
            </h2>
            <p
              className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Explore thoughtfully designed tools that empower you to understand yourself better and foster lasting positive habits.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={index * 200}
                className={`p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-20 h-20 rounded-2xl mb-4 mx-auto ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-700 to-gray-800"
                      : "bg-gradient-to-br from-gray-50 to-gray-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 text-center ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-center leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
