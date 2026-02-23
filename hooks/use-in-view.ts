import { useEffect, useRef, useState } from "react";

/**
 * A reusable hook that tracks when an element is visible in the viewport.
 * 
 * @param options IntersectionObserver options (optional)
 * @returns { ref, isVisible }
 * 
 * Example:
 * const { ref, isVisible } = useInView({ threshold: 0.2 });
 * <div ref={ref}>{isVisible && "Visible!"}</div>
 */
export function useInView<T extends HTMLElement>(options: IntersectionObserverInit = { threshold: 0.1 }) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);

  return { ref, isVisible };
}
