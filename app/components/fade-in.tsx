import { useEffect, useRef, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const FadeIn = ({ children, className = '', delay = 0 }: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Reset the animation by removing and re-adding classes
            element.classList.remove('opacity-100', 'translate-y-0');
            element.classList.add('opacity-0', 'translate-y-4');
            
            // Force a reflow
            void element.offsetWidth;
            
            // Add the animation classes with delay
            setTimeout(() => {
              element.classList.add('opacity-100', 'translate-y-0');
              element.classList.remove('opacity-0', 'translate-y-4');
            }, delay);
          } else {
            // Reset when out of view
            element.classList.remove('opacity-100', 'translate-y-0');
            element.classList.add('opacity-0', 'translate-y-4');
          }
        });
      },
      {
        threshold: 0.1,
        // Add a small margin to trigger slightly before the element comes into view
        rootMargin: '50px 0px'
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out opacity-0 translate-y-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeIn; 