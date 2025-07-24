import React, { useEffect, useState } from "react";

export default function BottomReminderCard() {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("bottomReminderLastShown");
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown, 10) > 24 * 60 * 60 * 1000) {
      setShowCard(true);
    }
  }, []);

  const closeCard = () => {
    setShowCard(false);
    localStorage.setItem("bottomReminderLastShown", Date.now().toString());
  };

  if (!showCard) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center space-x-4">
      <div className="flex-1">
        <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          Please fill out your stress form and check your mood today for better tracking!
        </p>
      </div>
      <button
        onClick={closeCard}
        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base"
      >
        Got it
      </button>
      <button
        onClick={closeCard}
        aria-label="Close reminder"
        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        &#10005;
      </button>
    </div>
  );
}
