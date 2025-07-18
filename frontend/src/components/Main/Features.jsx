import React from "react";
import { HabitIcon, JournalIcon, MoodIcon, TherapistIcon } from "./CustomIcons";
import { ScrollReveal } from "./ScrollReveal";

const Features = () => {
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
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for
              <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                {" "}
                better wellness
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore thoughtfully designed tools that empower you to understand yourself better and foster lasting positive habits.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={index * 200}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
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
