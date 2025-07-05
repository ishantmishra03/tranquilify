import React, { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getTransformClasses = () => {
    const baseClasses = 'transition-all duration-1000 ease-out';

    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseClasses} translate-y-16 opacity-0`;
        case 'down':
          return `${baseClasses} -translate-y-16 opacity-0`;
        case 'left':
          return `${baseClasses} translate-x-16 opacity-0`;
        case 'right':
          return `${baseClasses} -translate-x-16 opacity-0`;
        case 'fade':
          return `${baseClasses} opacity-0`;
        default:
          return `${baseClasses} translate-y-16 opacity-0`;
      }
    }

    return `${baseClasses} translate-y-0 translate-x-0 opacity-100`;
  };

  return (
    <div ref={ref} className={`${getTransformClasses()} ${className}`}>
      {children}
    </div>
  );
};
