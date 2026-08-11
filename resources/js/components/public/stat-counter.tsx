import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type StatCounterProps = {
    value: number;
    suffix?: string;
    label: string;
    className?: string;
};

function formatStat(value: number): string {
    return value.toLocaleString('en-GB');
}

export function StatCounter({ value, suffix = '+', label, className }: StatCounterProps) {
    // Start at the final value so SSR and the first client render match.
    const [count, setCount] = useState(value);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return;
        }

        const el = ref.current;

        if (!el) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasAnimated.current) {
                    return;
                }

                hasAnimated.current = true;
                setCount(0);

                const duration = 600;
                const start = performance.now();

                function tick(now: number) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * value));

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                }

                requestAnimationFrame(tick);
            },
            { threshold: 0.3 },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref} className={cn('text-center', className)}>
            <p className="font-serif text-4xl font-bold leading-none md:text-5xl">
                {formatStat(count)}
                {suffix}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider opacity-80">{label}</p>
        </div>
    );
}
