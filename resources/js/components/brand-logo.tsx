import type { ImgHTMLAttributes } from 'react';
import { brandAlt, brandAssets, type BrandLogoVariant } from '@/lib/brand';
import { cn } from '@/lib/utils';

type BrandLogoProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt'
> & {
    variant?: BrandLogoVariant;
    alt?: string;
};

const variantHeight: Partial<Record<BrandLogoVariant, string>> = {
    primary: 'h-9',
    mono: 'h-9',
    stacked: 'h-16',
    stackedMono: 'h-16',
    mark: 'h-9',
    markMono: 'h-9',
};

export function BrandLogo({
    variant = 'primary',
    className,
    alt = brandAlt,
    ...props
}: BrandLogoProps) {
    return (
        <img
            src={brandAssets[variant]}
            alt={alt}
            decoding="async"
            className={cn(
                'w-auto object-contain',
                variantHeight[variant],
                className,
            )}
            {...props}
        />
    );
}
