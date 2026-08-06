import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

type EngagementCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    buttonLabel?: string;
    className?: string;
};

export function EngagementCard({
    title,
    description,
    icon: Icon,
    href,
    buttonLabel = 'Learn More',
    className,
}: EngagementCardProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-md transition-shadow hover:shadow-xl',
                className,
            )}
        >
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-navy">
                <Icon className="size-6 text-brand-green-light" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <Button asChild variant="outline" className="mt-6 border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                <Link href={href}>{buttonLabel}</Link>
            </Button>
        </div>
    );
}
