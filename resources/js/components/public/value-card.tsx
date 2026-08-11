import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ValueCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    className?: string;
};

export function ValueCard({ title, description, icon: Icon, className }: ValueCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-border bg-white p-6 text-center transition-shadow hover:shadow-lg dark:bg-card',
                className,
            )}
        >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-green/10">
                <Icon className="size-6 text-brand-green" />
            </div>
            <h3 className="font-serif text-base font-semibold text-navy dark:text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}
