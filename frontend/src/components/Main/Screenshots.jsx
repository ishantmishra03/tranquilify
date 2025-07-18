import { ScrollReveal } from "./ScrollReveal";
import { MoodIcon, MindfulIcon, InsightIcon } from "./CustomIcons";
import { useAppContext } from "../../context/AppContext";

const screenshots = [
  {
    icon: <MoodIcon className="w-16 h-16" />,
    title: "Emotional Tracking",
    description: "Visualize your emotional journey and understand how you feel over time.",
  },
  {
    icon: <InsightIcon className="w-16 h-16" />,
    title: "Wellness Insights",
    description: "Discover meaningful patterns and trends through smart analytics.",
  },
  {
    icon: <MindfulIcon className="w-16 h-16" />,
    title: "Mindful Practices",
    description: "Access guided breathing, grounding, and relaxation exercises anytime.",
  },
];

const Screenshots = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div>
      <section
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
        id="screenshots"
      >
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Explore the Tranquilify Experience
            </h2>
            <p
              className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              A modern, intuitive interface designed to support your mental well-being—effortlessly and beautifully.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenshots.map((screenshot, index) => {
              const baseGradient = isDarkMode
                ? "bg-gray-800"
                : index === 0
                ? "bg-gradient-to-br from-rose-100 to-rose-200"
                : index === 1
                ? "bg-gradient-to-br from-sky-100 to-sky-200"
                : "bg-gradient-to-br from-emerald-100 to-emerald-200";

              return (
                <ScrollReveal
                  key={index}
                  direction="up"
                  delay={index * 200}
                  className={`${baseGradient} rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex justify-center mb-4">{screenshot.icon}</div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {screenshot.title}
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {screenshot.description}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Screenshots;
