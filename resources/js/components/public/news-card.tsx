import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Calendar, ChevronRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const categoryBadge = cva('inline-block rounded-full px-3 py-1 text-xs font-extrabold tracking-wide text-white', {
    variants: {
        category: {
            education: 'bg-brand-green',
            healthcare: 'bg-brand-gold',
            community: 'bg-brand-blue',
            relief: 'bg-brand-gold',
        },
    },
    defaultVariants: {
        category: 'education',
    },
});

type NewsCardProps = {
    title: string;
    excerpt: string;
    date: string;
    category: NonNullable<VariantProps<typeof categoryBadge>['category']>;
    image?: string;
    href: string;
    featured?: boolean;
    className?: string;
};

export function NewsCard({
    title,
    excerpt,
    date,
    category,
    image,
    href,
    featured = false,
    className,
}: NewsCardProps) {
    if (featured) {
        return (
            <Link href={href} className={cn('group', className)}>
                <div className="flex flex-col overflow-hidden rounded-2xl shadow-xl sm:flex-row">
                    {image && (
                        <div className="min-h-[280px] flex-1 overflow-hidden">
                            <img
                                src={image}
                                alt={title}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                width={600}
                                height={400}
                            />
                        </div>
                    )}
                    <div className="flex flex-1 flex-col justify-center bg-navy-dark p-8 md:p-10">
                        <span className="mb-4 self-start rounded-full bg-brand-green-light/15 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-green-light">
                            Featured
                        </span>
                        <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
                            <Calendar className="size-3.5 text-brand-green-light" />
                            {date}
                        </div>
                        <h3 className="font-serif text-xl font-semibold leading-snug text-white md:text-2xl">
                            {title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">{excerpt}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-green-light">
                            Read Full Story
                            <ChevronRight className="size-3.5" />
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={href} className={cn('group', className)}>
            <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl">
                {image && (
                    <div className="relative overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            width={400}
                            height={192}
                            loading="lazy"
                        />
                        <span className={cn('absolute left-3.5 top-3.5', categoryBadge({ category }))}>
                            {category.toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="p-5">
                    <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        {date}
                    </div>
                    <h3 className="font-serif text-base font-semibold leading-snug text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark">
                        Read More
                        <ChevronRight className="size-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
