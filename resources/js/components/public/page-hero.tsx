import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

type PageHeroProps = {
    title: string;
    image?: string;
    className?: string;
};

export function PageHero({ title, image, className }: PageHeroProps) {
    return (
        <div className={cn('relative flex min-h-[260px] items-center overflow-hidden bg-navy-dark', className)}>
            {image && (
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-[0.28]"
                    width={1440}
                    height={400}
                />
            )}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(120deg, oklch(0.24 0.06 258) 0%, oklch(0.24 0.06 258 / 0.85) 55%, oklch(0.60 0.14 240 / 0.35) 100%)',
                }}
            />
            <div className="relative z-10 w-full px-4 text-center md:px-6">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-green-light/40 bg-brand-green-light/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-green-light">
                    <Heart className="size-3" fill="currentColor" />
                    HopeSpring Foundation
                </div>
                <h1 className="font-serif text-3xl font-semibold text-white md:text-5xl">{title}</h1>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
                    <Link href="/" className="text-white/50 transition-colors hover:text-white/70">
                        Home
                    </Link>
                    <span className="text-brand-green">/</span>
                    <span className="text-brand-green-light">{title}</span>
                </div>
            </div>
        </div>
    );
}
