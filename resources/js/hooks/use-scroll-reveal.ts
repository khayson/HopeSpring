import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
    const ref = useRef<T>(null);
    // Visible by default so SSR HTML matches the first client render.
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsVisible(true);
            return;
        }

        const rect = el.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0;

        // Above-the-fold content stays visible — no flash after hydration.
        if (alreadyInView) {
            setIsVisible(true);
            return;
        }

        setIsVisible(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
}
