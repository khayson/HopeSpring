import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { BrushEdge } from './brush-edge';

type DonationBandProps = {
    title?: string;
    description?: string;
    className?: string;
};

export function DonationBand({
    title = 'Make a Difference Today',
    description = 'Your donation helps provide clean water, education, and healthcare to communities across Ghana. Every contribution, no matter the size, transforms lives.',
    className,
}: DonationBandProps) {
    return (
        <section className={cn('relative', className)}>
            <BrushEdge className="h-8 text-brand-green md:h-12" />
            <div className="bg-brand-green px-4 py-12 text-center text-white md:py-16">
                <div className="mx-auto max-w-2xl">
                    <Heart className="mx-auto mb-4 size-8 opacity-80" fill="currentColor" />
                    <h2 className="font-serif text-3xl font-bold md:text-4xl">{title}</h2>
                    <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85">
                        {description}
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white font-bold text-brand-green hover:bg-white/90"
                        >
                            <Link href="/donate">Donate Now</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/40 font-bold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/get-involved">Get Involved</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
