import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

type BrandLoaderProps = {
    className?: string;
    label?: string;
};

export function BrandLoader({
    className,
    label = 'Loading',
}: BrandLoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className={cn(
                'flex flex-col items-center justify-center gap-3',
                className,
            )}
        >
            <div className="brand-loader relative flex size-16 items-center justify-center">
                <span className="brand-loader-ripple absolute inset-0 rounded-full" />
                <span className="brand-loader-ripple brand-loader-ripple-delay absolute inset-0 rounded-full" />
                <BrandLogo
                    variant="mark"
                    className="brand-loader-mark relative z-10 h-12 w-12"
                />
            </div>
            <span className="sr-only">{label}</span>
        </div>
    );
}
