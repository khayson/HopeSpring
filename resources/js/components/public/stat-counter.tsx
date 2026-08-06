import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

type StatCounterProps = {
    value: number;
    suffix?: string;
    label: string;
    className?: string;
};

function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();

                    function tick(now: number) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    }

                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

export function StatCounter({ value, suffix = '+', label, className }: StatCounterProps) {
    const { count, ref } = useCountUp(value);

    return (
        <div ref={ref} className={cn('text-center', className)}>
            <p className="font-serif text-4xl font-bold leading-none md:text-5xl">
                {count.toLocaleString()}
                {suffix}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider opacity-80">{label}</p>
        </div>
    );
}
