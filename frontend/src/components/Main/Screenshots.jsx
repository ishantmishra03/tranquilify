import { ScrollReveal } from "./ScrollReveal";
import { MoodIcon, MindfulIcon, InsightIcon } from './CustomIcons';

  const screenshots = [
    {
      icon: <MoodIcon className="w-16 h-16" />,
      title: "Mood Dashboard",
      description: "Track your emotions with beautiful visualizations"
    },
    {
      icon: <InsightIcon className="w-16 h-16" />,
      title: "Progress Insights",
      description: "Understand your patterns with smart analytics"
    },
    {
      icon: <MindfulIcon className="w-16 h-16" />,
      title: "Mindful Moments",
      description: "Guided exercises for peace and clarity"
    }
  ];

const Screenshots = () => {
  return (
    <div>
      {/* Screenshots Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="screenshots">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See MindBalance in action
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A beautiful, intuitive interface designed to make wellness tracking effortless and enjoyable.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenshots.map((screenshot, index) => (
              <ScrollReveal 
                key={index}
                direction="up"
                delay={index * 200}
                className={`${
                  index === 0 ? 'bg-gradient-to-br from-rose-100 to-rose-200' :
                  index === 1 ? 'bg-gradient-to-br from-sky-100 to-sky-200' :
                  'bg-gradient-to-br from-emerald-100 to-emerald-200'
                } rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex justify-center mb-4">
                  {screenshot.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{screenshot.title}</h3>
                <p className="text-gray-600">{screenshot.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Screenshots
