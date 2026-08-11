import { Link } from '@inertiajs/react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const cardVariants = cva('group overflow-hidden rounded-xl transition-shadow', {
    variants: {
        variant: {
            light: 'bg-white shadow-md hover:shadow-xl dark:bg-card',
            dark: 'bg-navy text-white shadow-lg hover:shadow-2xl',
        },
    },
    defaultVariants: {
        variant: 'light',
    },
});

type ProgrammeCardProps = VariantProps<typeof cardVariants> & {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    image?: string;
    href?: string;
    className?: string;
};

export function ProgrammeCard({
    title,
    description,
    icon: Icon,
    iconColor = 'bg-brand-green',
    image,
    href,
    variant,
    className,
}: ProgrammeCardProps) {
    const content = (
        <div className={cn(cardVariants({ variant }), className)}>
            {image && (
                <div className="overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-48 w-full object-cover"
                        width={400}
                        height={192}
                        loading="lazy"
                    />
                </div>
            )}
            <div className="p-6">
                <div
                    className={cn(
                        'mb-4 flex size-11 items-center justify-center rounded-full',
                        iconColor,
                    )}
                >
                    <Icon className="size-5 text-white" />
                </div>
                <h3
                    className={cn(
                        'font-serif text-lg font-semibold',
                        variant === 'dark' ? 'text-white' : 'text-navy',
                    )}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        'mt-2 text-sm leading-relaxed',
                        variant === 'dark'
                            ? 'text-white/70'
                            : 'text-muted-foreground',
                    )}
                >
                    {description}
                </p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
