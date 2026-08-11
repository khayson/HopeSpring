import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PageHeroProps = {
    title: string;
    subtitle?: string;
    image?: string;
    breadcrumbs?: { label: string; href?: string }[];
    className?: string;
};

export function PageHero({
    title,
    subtitle,
    image,
    breadcrumbs,
    className,
}: PageHeroProps) {
    const crumbs = breadcrumbs ?? [
        { label: 'Home', href: '/' },
        { label: title },
    ];

    return (
        <div
            className={cn(
                'relative flex min-h-[260px] items-end overflow-hidden bg-navy-dark md:min-h-[320px]',
                className,
            )}
        >
            {image ? (
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 size-full scale-105 object-cover"
                    width={1440}
                    height={400}
                />
            ) : (
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            )}

            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: image
                        ? 'linear-gradient(115deg, oklch(0.18 0.05 258 / 0.88) 0%, oklch(0.22 0.06 258 / 0.7) 48%, oklch(0.24 0.06 258 / 0.45) 100%)'
                        : 'linear-gradient(135deg, oklch(0.24 0.06 258) 0%, oklch(0.28 0.07 258) 50%, oklch(0.24 0.06 258) 100%)',
                }}
            />
            {image && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, oklch(0.18 0.05 258 / 0.72) 0%, transparent 55%)',
                    }}
                />
            )}

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-12 pb-8 md:px-6 md:pb-10">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex items-center gap-1.5 text-xs font-medium"
                >
                    {crumbs.map((crumb, i) => {
                        const isLast = i === crumbs.length - 1;

                        return (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && (
                                    <ChevronRight
                                        className="size-3 text-white/30"
                                        aria-hidden="true"
                                    />
                                )}
                                {crumb.href && !isLast ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-white/50 transition-colors hover:text-white/80"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={
                                            isLast
                                                ? 'text-brand-green-light'
                                                : 'text-white/50'
                                        }
                                        aria-current={
                                            isLast ? 'page' : undefined
                                        }
                                    >
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </nav>

                <h1 className="font-serif text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
                    {title}
                </h1>

                <div className="mt-4 h-1 w-16 rounded-full bg-brand-green" />

                {subtitle && (
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
