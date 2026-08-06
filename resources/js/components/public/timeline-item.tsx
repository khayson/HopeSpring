import { cn } from '@/lib/utils';

type TimelineItemProps = {
    year: string;
    title: string;
    description: string;
    isLast?: boolean;
    className?: string;
};

export function TimelineItem({ year, title, description, isLast = false, className }: TimelineItemProps) {
    return (
        <div className={cn('relative flex gap-6 pb-8', className)}>
            {/* Line */}
            {!isLast && (
                <div className="absolute left-[15px] top-8 h-full w-0.5 bg-brand-green/20" />
            )}
            {/* Dot */}
            <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green">
                <div className="size-2.5 rounded-full bg-white" />
            </div>
            {/* Content */}
            <div className="pt-0.5">
                <span className="text-sm font-bold text-brand-green">{year}</span>
                <h3 className="mt-1 font-serif text-base font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
