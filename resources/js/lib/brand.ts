export const brandAssets = {
    primary: '/images/brand/logo-primary.png',
    mono: '/images/brand/logo-mono.png',
    stacked: '/images/brand/logo-stacked.png',
    stackedMono: '/images/brand/logo-stacked-mono.png',
    mark: '/images/brand/mark.png',
    markMono: '/images/brand/mark-mono.png',
} as const;

export type BrandLogoVariant = keyof typeof brandAssets;

export const brandAlt = 'HopeSpring Foundation';
