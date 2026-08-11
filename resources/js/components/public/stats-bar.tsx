import { cn } from '@/lib/utils';
import { StatCounter } from './stat-counter';

type Stat = {
    value: number;
    suffix?: string;
    label: string;
};

type StatsBarProps = {
    stats: Stat[];
    className?: string;
};

export function StatsBar({ stats, className }: StatsBarProps) {
    return (
        <div
            className={cn(
                'relative z-10 mx-auto -mt-12 max-w-5xl rounded-xl bg-white px-6 py-8 shadow-xl md:-mt-16 md:px-12 md:py-10 dark:bg-card',
                className,
            )}
        >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {stats.map((stat) => (
                    <StatCounter
                        key={stat.label}
                        value={stat.value}
                        suffix={stat.suffix}
                        label={stat.label}
                        className="text-navy dark:text-foreground"
                    />
                ))}
            </div>
        </div>
    );
}
