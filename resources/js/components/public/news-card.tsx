import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const categoryTone = cva('text-xs font-bold tracking-[0.16em] uppercase', {
    variants: {
        category: {
            education: 'text-brand-blue',
            healthcare: 'text-brand-gold',
            community: 'text-brand-green',
            relief: 'text-brand-gold',
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
    category: NonNullable<VariantProps<typeof categoryTone>['category']>;
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
            <Link href={href} className={cn('group block', className)}>
                <article className="grid overflow-hidden bg-navy lg:grid-cols-2">
                    <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
                        {image ? (
                            <img
                                src={image}
                                alt=""
                                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                width={800}
                                height={560}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-navy-dark" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent lg:hidden" />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-14 lg:px-12">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green-light uppercase">
                            Featured story
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
                            <time>{date}</time>
                            <span aria-hidden="true" className="text-white/25">
                                ·
                            </span>
                            <span className={cn(categoryTone({ category }), 'text-brand-green-light')}>
                                {category}
                            </span>
                        </div>
                        <h2 className="mt-4 font-serif text-2xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">{excerpt}</p>
                        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-green-light transition-colors group-hover:text-white">
                            Read full story
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={href} className={cn('group flex h-full flex-col', className)}>
            <article className="flex h-full flex-col overflow-hidden bg-white transition-transform duration-300 group-hover:-translate-y-1 dark:bg-card">
                <div className="relative overflow-hidden bg-secondary">
                    {image ? (
                        <img
                            src={image}
                            alt=""
                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            width={480}
                            height={360}
                            loading="lazy"
                        />
                    ) : (
                        <div className="aspect-[4/3] w-full bg-secondary" />
                    )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <time>{date}</time>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span className={categoryTone({ category })}>{category}</span>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-navy dark:text-foreground">
                        {title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-green-dark">
                        Read story
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </article>
        </Link>
    );
}
